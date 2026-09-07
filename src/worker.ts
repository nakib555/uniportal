import { executePortalSync } from './server/puProxy';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/proxy-image') {
      const urlString = url.searchParams.get('url') || '';
      const studentId = urlString.split('/').pop()?.split('.')[0] || '123456';
      
      const cleanId = studentId.trim();
      const initials = cleanId.slice(0, 2).toUpperCase() || 'ST';
      
      const colors = ['#8c1515', '#1e3a8a', '#115e59', '#3b0764', '#0f172a'];
      const charCodeSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const bg = colors[charCodeSum % colors.length];

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
          <rect width="100%" height="100%" fill="${bg}" />
          <text x="50%" y="55%" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
            ${initials}
          </text>
        </svg>
      `.trim();

      return new Response(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Only handle POST requests on /api/university-sync
    if (url.pathname === '/api/university-sync') {
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
        const { studentId, password, skipAdmitCard, admitCardOnly, module } = JSON.parse(bodyText || '{}');

        const result = await executePortalSync(studentId, password, { skipAdmitCard, admitCardOnly, module });

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
