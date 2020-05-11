const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

// need to add in case of self-signed certificate connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Import config file
const stage = process.env.BUILD_ENV || 'dev';
const configPath = path.resolve(process.cwd(), 'config', `.env.${stage}`);
require('dotenv').config({ path: configPath });

const { API_URL } = process.env;
const app = express();
const port = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${p} 'reason: ${reason}`);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

// Remove X-Powered-By in header
app.disable('x-powered-by');

// Disable etag
app.disable('etag');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  '/api',
  createProxyMiddleware({
    secure: false,
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {},
    router: function(req) {
      return API_URL;
    },
    onProxyReq(proxyReq, req) {
      const body = req.body;
      const method = req.method.toLowerCase();

      if (body && (method === 'post' || method === 'put')) {
        let contentType = req.get('Content-Type');
        contentType = contentType ? contentType.toLowerCase() : '';

        if (contentType.includes('application/json')) {
          const bodyData = JSON.stringify(body);

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const bodyData = Object.keys(body)
            .map(key => {
              let val = body[key];
              val = val ? val : '';
              return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            })
            .join('&');

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    },
  }),
);

if (process.env.NODE_ENV === 'production') {
  // Add compression
  app.use(compression());
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build'), {
    maxAge: '7d', // One week
  }));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
