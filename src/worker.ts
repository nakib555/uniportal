import { executePresidencySync } from './server/puProxy';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Only handle POST requests on /api/pu-sync
    if (url.pathname === '/api/pu-sync') {
      // CORS preflight options request
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          }
        });
      }

      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      try {
        const bodyText = await request.text();
        const { studentId, password, skipAdmitCard, admitCardOnly } = JSON.parse(bodyText || '{}');

        const result = await executePresidencySync(studentId, password, { skipAdmitCard, admitCardOnly });

        return new Response(JSON.stringify(result), {
          status: result.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message || 'Worker server sync error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // CORS preflight globally
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        }
      });
    }

    // Return a 404 response for other non-asset paths
    // Cloudflare Workers Assets will serve matched static assets first.
    // If a request falls through to the worker fetch handler, it's not a static asset,
    // so we return 404 Not Found.
    return new Response(JSON.stringify({ success: false, error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
