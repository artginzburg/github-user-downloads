/**
 * Runs `mapper` over `items` while keeping at most `concurrency` calls in flight
 * at any moment. Results preserve input order.
 *
 * Firing every repo (and every release within a repo) at GitHub in parallel trips
 * its secondary rate limit, which surfaces as dropped connections ("Premature
 * close"). Pacing the requests through a small pool stays under that threshold
 * without skipping any work.
 *
 * @template T, R
 * @param {readonly T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<R>} mapper
 * @returns {Promise<R[]>}
 */
async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  const limit = Math.max(1, Math.min(concurrency, items.length || 1));

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));

  return results;
}

module.exports = { mapWithConcurrency };
