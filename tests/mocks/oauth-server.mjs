import http from 'http';
import { URLSearchParams } from 'url';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[Mock OAuth] Received request for ${url.pathname}`);

  if (url.pathname === '/authorize') {
    const params = url.searchParams;
    const redirectUri = params.get('redirect_uri');
    const state = params.get('state');

    if (!redirectUri || !state) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing redirect_uri or state');
      return;
    }

    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', 'mock_auth_code');
    callbackUrl.searchParams.set('state', state);

    console.log(`[Mock OAuth] Redirecting to ${callbackUrl.toString()}`);
    res.writeHead(302, { Location: callbackUrl.toString() });
    res.end();
  } else if (url.pathname === '/token') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      if (params.get('code') === 'mock_auth_code') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          expires_in: 3600,
        }));
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid code');
      }
    });
  } else if (url.pathname === '/userinfo') {
    if (req.headers.authorization === 'Bearer mock_access_token') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'mock_user_123',
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.png',
        provider: 'mock_provider',
      }));
    } else {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 8080;
server.listen(port, () => {
  console.log(`[Mock OAuth] Server listening on port ${port}`);
});