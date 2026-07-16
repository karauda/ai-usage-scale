/**
 * Walk the decision tree to a level. Pure and shared, so the same logic the MCP server exposes
 * is the logic the test exercises.
 *
 * Returns null when the answers run out before a level is reached — a missing answer must NOT be
 * silently read as "no", or partial input (which agents send routinely) resolves to a confident
 * wrong level.
 */
export function classify(tree, answers) {
  for (let i = 0; i < tree.length; i++) {
    if (i >= answers.length) return null; // ran out of answers before terminating
    const out = tree[i][answers[i] ? 'yes' : 'no'];
    if (typeof out === 'number') return out;
  }
  return null;
}
