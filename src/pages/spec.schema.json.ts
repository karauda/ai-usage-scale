import type { APIRoute } from 'astro';
import schema from '../../spec/levels.schema.json';
export const GET: APIRoute = () => new Response(JSON.stringify(schema, null, 2), {
  headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
});
