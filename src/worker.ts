import { executePresidencySync } from './server/puProxy';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/proxy-image') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return new Response('Missing url parameter', { status: 400 });
      }
      try {
        const targetRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'http://sims.pu.edu.bd/students/profile'
          }
        });
        
        // Prevent downloading "No Image Available" generic placeholders
        if (/no[_\-]?photo|no[_\-]?image|not[_\-]?available|default|blank|avatar/i.test(targetRes.url)) {
          return new Response('Placeholder image', { status: 404 });
        }
        
        const contentType = targetRes.headers.get('content-type') || 'application/octet-stream';
        return new Response(targetRes.body, {
          status: targetRes.status,
          headers: {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      } catch (err) {
        return new Response('Failed to fetch image', { status: 500 });
      }
    }

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

    // If assets binding is present, let it handle static assets or SPA index fallback
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
      if (request.headers.get('accept')?.includes('text/html') || request.method === 'GET') {
        const indexUrl = new URL('/index.html', request.url);
        return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
      }
    }

    // Return a 404 response for other non-asset paths
    return new Response(JSON.stringify({ success: false, error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
