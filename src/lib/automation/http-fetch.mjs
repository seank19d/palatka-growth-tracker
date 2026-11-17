/**
 * Shared HTTP fetch helpers for the tracker update job.
 * Plain ESM so scripts/*.test.mjs can import without a TS build step.
 */

export const DEFAULT_UA =
  "Mozilla/5.0 (compatible; PalatkaHomesReport/1.1; +https://www.palatkahomesreport.com/about)";

/** Status codes that are worth retrying with backoff. */
export function isRetryableStatus(status) {
  return status === 429 || status === 503;
}

/** True when a recorded source error string is a rate-limit / overload response. */
export function isRateLimitError(message) {
  return /\bHTTP\s+(429|503)\b/i.test(String(message ?? ""));
}

/**
 * Parse Retry-After: delta-seconds or HTTP-date.
 * Returns delay in ms, or null if missing/unusable.
 */
export function parseRetryAfterMs(headerValue, nowMs = Date.now()) {
  if (headerValue == null || headerValue === "") return null;
  const raw = String(headerValue).trim();
  if (/^\d+$/.test(raw)) {
    const sec = Number(raw);
    if (!Number.isFinite(sec) || sec < 0) return null;
    return Math.min(sec * 1000, 120_000);
  }
  const when = Date.parse(raw);
  if (Number.isNaN(when)) return null;
  const delta = when - nowMs;
  if (delta <= 0) return 0;
  return Math.min(delta, 120_000);
}

/**
 * Exponential backoff with jitter. Honors Retry-After when present.
 * attempt is 0-based (0 = first retry after the initial failure).
 */
export function backoffDelayMs(attempt, retryAfterHeader, nowMs = Date.now()) {
  const fromHeader = parseRetryAfterMs(retryAfterHeader, nowMs);
  if (fromHeader != null) return fromHeader;
  const base = Math.min(1000 * 2 ** attempt, 30_000);
  const jitter = Math.floor(Math.random() * 250);
  return base + jitter;
}

/**
 * Alert only when enough non-rate-limit source errors remain after retries.
 * Transient 429/503 noise should not page humans when the next run can recover.
 */
export function shouldAlertOnSourceErrors(errors, threshold = 3) {
  const hard = (errors ?? []).filter((e) => !isRateLimitError(e));
  return hard.length >= threshold;
}

/** Per-host spacing so Google News (and similar) are not hammered. */
export function createHostThrottle(options = {}) {
  const defaultGapMs = options.defaultGapMs ?? 400;
  const hostGaps = options.hostGaps ?? {
    "news.google.com": 2500,
  };
  const lastByHost = new Map();

  function gapFor(hostname) {
    return hostGaps[hostname] ?? defaultGapMs;
  }

  return {
    async wait(url) {
      let hostname = "";
      try {
        hostname = new URL(url).hostname;
      } catch {
        return;
      }
      const gap = gapFor(hostname);
      const last = lastByHost.get(hostname) ?? 0;
      const waitMs = last + gap - Date.now();
      if (waitMs > 0) {
        await sleep(waitMs);
      }
      lastByHost.set(hostname, Date.now());
    },
    _lastByHost: lastByHost,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch text with retries on 429/503 (honoring Retry-After) and optional host throttle.
 * On failure returns { ok:false, error } — callers keep prior good content.
 */
export async function fetchText(url, options = {}) {
  const {
    timeoutMs = 10_000,
    maxAttempts = 4,
    userAgent = DEFAULT_UA,
    throttle = null,
    fetchImpl = globalThis.fetch,
    sleepImpl = sleep,
    nowImpl = Date.now,
  } = options;

  if (throttle) await throttle.wait(url);

  let lastError = "fetch failed";

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        signal: ctrl.signal,
        redirect: "follow",
        headers: {
          "User-Agent": userAgent,
          Accept:
            "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
        },
      });
      if (res.ok) {
        const text = await res.text();
        return { ok: true, text };
      }
      lastError = `HTTP ${res.status}`;
      if (!isRetryableStatus(res.status) || attempt === maxAttempts - 1) {
        return { ok: false, error: lastError };
      }
      const delay = backoffDelayMs(
        attempt,
        res.headers?.get?.("retry-after") ?? null,
        nowImpl(),
      );
      await sleepImpl(delay);
    } catch (err) {
      lastError = err instanceof Error ? err.message : "fetch failed";
      if (attempt === maxAttempts - 1) {
        return { ok: false, error: lastError };
      }
      await sleepImpl(backoffDelayMs(attempt, null, nowImpl()));
    } finally {
      clearTimeout(t);
    }
  }

  return { ok: false, error: lastError };
}

/** Fail-closed cron gate: only a configured Bearer CRON_SECRET authorizes. */
export function isCronAuthorized(request, env = process.env) {
  const secret = String(env?.CRON_SECRET ?? "").trim();
  if (!secret) return false;
  const auth = request.headers?.get?.("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}
