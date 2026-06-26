const TRANSIENT_STATUS = new Set([403, 408, 429, 500, 502, 503, 504]);

/**
 * GitHub answers a burst of requests with secondary-rate-limit responses (403/429
 * with a `Retry-After`) or by dropping the connection mid-response, which surfaces
 * as a network error such as "Premature close" / `ECONNRESET`. Octokit does not
 * retry these on its own, so we wrap each call.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{ retries?: number, baseDelayMs?: number }} [options]
 * @returns {Promise<T>}
 */
async function withRetry(fn, { retries = 4, baseDelayMs = 1000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      if (!isRetryable(error) || attempt === retries) throw error;
      lastError = error;
      await delay(retryDelayMs(error, attempt, baseDelayMs));
    }
  }

  throw lastError;
}

function isRetryable(error) {
  // Network-level drops (no HTTP status) — e.g. "Premature close", ECONNRESET.
  if (typeof error.status !== 'number') return true;
  return TRANSIENT_STATUS.has(error.status);
}

function retryDelayMs(error, attempt, baseDelayMs) {
  const retryAfter = Number(error?.response?.headers?.['retry-after']);
  if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1000;

  const backoff = baseDelayMs * 2 ** attempt;
  const jitter = backoff * 0.25 * Math.random();
  return backoff + jitter;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { withRetry };
