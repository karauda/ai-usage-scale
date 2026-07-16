import type { APIRoute } from 'astro';
import { ECOSYSTEM } from '../data/ecosystem';

/**
 * The AI-provenance ecosystem as machine-readable data — the same map as /ecosystem, for tools
 * that want to reason about where the AI Usage Scale sits: what it interoperates with, what it
 * complements, and what it deliberately does not rely on.
 */

const SITE = 'https://usagescale.org';

export const GET: APIRoute = () => {
  const body = {
    $comment:
      'The AI-provenance ecosystem, mapped by the AI Usage Scale. `relation`: interoperates = we emit its vocabulary or map into it; complements = answers a different question and pairs with us; adjacent = neighbouring signal or prior art; cautioned = listed with the evidence, not endorsed.',
    self: `${SITE}/ecosystem.json`,
    page: `${SITE}/ecosystem`,
    standard: `${SITE}/levels.json`,
    categories: ECOSYSTEM,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
