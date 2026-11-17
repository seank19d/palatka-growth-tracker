import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  backoffDelayMs,
  createHostThrottle,
  fetchText,
  isCronAuthorized,
  isRateLimitError,
  isRetryableStatus,
  parseRetryAfterMs,
  shouldAlertOnSourceErrors,
} from "../src/lib/automation/http-fetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function headers(map) {
  return {
    get(name) {
      const key = String(name).toLowerCase();
      for (const [k, v] of Object.entries(map ?? {})) {
        if (k.toLowerCase() === key) return v;
      }
      return null;
    },
  };
}

test("isRetryableStatus covers 429 and 503 only", () => {
  assert.equal(isRetryableStatus(429), true);
  assert.equal(isRetryableStatus(503), true);
  assert.equal(isRetryableStatus(500), false);
  assert.equal(isRetryableStatus(404), false);
});

test("parseRetryAfterMs reads delta-seconds and HTTP-date", () => {
  assert.equal(parseRetryAfterMs("2"), 2000);
  assert.equal(parseRetryAfterMs("0"), 0);
  assert.equal(parseRetryAfterMs(null), null);
  assert.equal(parseRetryAfterMs("nope"), null);

  const now = Date.parse("Thu, 01 Jan 2026 00:00:00 GMT");
  const later = "Thu, 01 Jan 2026 00:00:05 GMT";
  assert.equal(parseRetryAfterMs(later, now), 5000);
});

test("backoffDelayMs prefers Retry-After over exponential backoff", () => {
  const delay = backoffDelayMs(0, "3", Date.now());
  assert.equal(delay, 3000);

  const exp = backoffDelayMs(0, null, Date.now());
  assert.ok(exp >= 1000 && exp < 2000);
});

test("isRateLimitError / shouldAlertOnSourceErrors ignore 429/503 noise", () => {
  assert.equal(isRateLimitError("Google News: HTTP 429"), true);
  assert.equal(isRateLimitError("SJRWMD: HTTP 503"), true);
  assert.equal(isRateLimitError("City: HTTP 404"), false);

  assert.equal(
    shouldAlertOnSourceErrors([
      "A: HTTP 429",
      "B: HTTP 429",
      "C: HTTP 503",
    ]),
    false,
  );
  assert.equal(
    shouldAlertOnSourceErrors([
      "A: HTTP 404",
      "B: boom",
      "C: HTTP 500",
    ]),
    true,
  );
  assert.equal(
    shouldAlertOnSourceErrors([
      "A: HTTP 429",
      "B: HTTP 404",
      "C: timeout",
    ]),
    false,
  );
});

test("fetchText retries 429 with Retry-After then succeeds", async () => {
  const sleeps = [];
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls < 3) {
      return {
        ok: false,
        status: 429,
        headers: headers({ "retry-after": "1" }),
        text: async () => "",
      };
    }
    return {
      ok: true,
      status: 200,
      headers: headers({}),
      text: async () => "<rss/>",
    };
  };

  const result = await fetchText("https://news.google.com/rss/search?q=x", {
    fetchImpl,
    sleepImpl: async (ms) => {
      sleeps.push(ms);
    },
    maxAttempts: 4,
  });

  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.text, "<rss/>");
  assert.equal(calls, 3);
  assert.deepEqual(sleeps, [1000, 1000]);
});

test("fetchText does not retry hard 404 and keeps error string", async () => {
  let calls = 0;
  const result = await fetchText("https://example.com/missing", {
    fetchImpl: async () => {
      calls += 1;
      return {
        ok: false,
        status: 404,
        headers: headers({}),
        text: async () => "nope",
      };
    },
    sleepImpl: async () => {
      throw new Error("should not sleep");
    },
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error, "HTTP 404");
  assert.equal(calls, 1);
});

test("fetchText spaces requests to the same host via throttle", async () => {
  const waits = [];
  const throttle = createHostThrottle({
    defaultGapMs: 50,
    hostGaps: { "news.google.com": 80 },
  });
  // Seed last-hit so the second wait must delay.
  await throttle.wait("https://news.google.com/rss/a");
  const started = Date.now();
  await throttle.wait("https://news.google.com/rss/b");
  waits.push(Date.now() - started);
  assert.ok(waits[0] >= 60, `expected host gap, got ${waits[0]}ms`);
});

test("isCronAuthorized requires Bearer CRON_SECRET and rejects x-vercel-cron spoof", () => {
  const env = { CRON_SECRET: "s3cret" };
  assert.equal(
    isCronAuthorized({ headers: headers({ authorization: "Bearer s3cret" }) }, env),
    true,
  );
  assert.equal(
    isCronAuthorized({ headers: headers({ "x-vercel-cron": "1" }) }, env),
    false,
  );
  assert.equal(
    isCronAuthorized({ headers: headers({ authorization: "Bearer wrong" }) }, env),
    false,
  );
  assert.equal(
    isCronAuthorized({ headers: headers({ authorization: "Bearer s3cret" }) }, {}),
    false,
  );
  assert.equal(
    isCronAuthorized({ headers: headers({ authorization: "Bearer s3cret" }) }, { CRON_SECRET: "  " }),
    false,
  );
});

test("cron route and stale kick use Bearer secret, not x-vercel-cron", () => {
  const cronRoute = readFileSync(join(root, "src/routes/api/cron/update.ts"), "utf8");
  assert.match(cronRoute, /isCronAuthorized/);
  assert.doesNotMatch(cronRoute, /x-vercel-cron/);

  const runUpdate = readFileSync(join(root, "src/lib/automation/run-update.server.ts"), "utf8");
  assert.match(runUpdate, /Authorization: `Bearer \$\{secret\}`/);
  assert.doesNotMatch(runUpdate, /["']x-vercel-cron["']/);
  assert.match(runUpdate, /shouldAlertOnSourceErrors/);
  assert.match(runUpdate, /createHostThrottle/);

  const seed = readFileSync(join(root, "src/lib/data/seed-meta.ts"), "utf8");
  assert.match(seed, /Google News — Palatka housing & permits/);
  assert.match(seed, /permitting\.sjrwmd\.com/);
  assert.doesNotMatch(seed, /Google News — Palatka development/);
  assert.doesNotMatch(seed, /Google News — Collection/);
});
