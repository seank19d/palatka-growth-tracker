declare module "@/lib/automation/http-fetch.mjs" {
  export const DEFAULT_UA: string;

  export function isRetryableStatus(status: number): boolean;
  export function isRateLimitError(message: string | null | undefined): boolean;
  export function parseRetryAfterMs(
    headerValue: string | null | undefined,
    nowMs?: number,
  ): number | null;
  export function backoffDelayMs(
    attempt: number,
    retryAfterHeader: string | null | undefined,
    nowMs?: number,
  ): number;
  export function shouldAlertOnSourceErrors(
    errors: string[] | null | undefined,
    threshold?: number,
  ): boolean;

  export type HostThrottle = {
    wait: (url: string) => Promise<void>;
  };

  export function createHostThrottle(options?: {
    defaultGapMs?: number;
    hostGaps?: Record<string, number>;
  }): HostThrottle;

  export function fetchText(
    url: string,
    options?: {
      timeoutMs?: number;
      maxAttempts?: number;
      userAgent?: string;
      throttle?: HostThrottle | null;
      fetchImpl?: typeof fetch;
      sleepImpl?: (ms: number) => Promise<void>;
      nowImpl?: () => number;
    },
  ): Promise<{ ok: true; text: string } | { ok: false; error: string }>;

  export function isCronAuthorized(
    request: { headers: { get: (name: string) => string | null } },
    env?: { CRON_SECRET?: string },
  ): boolean;
}
