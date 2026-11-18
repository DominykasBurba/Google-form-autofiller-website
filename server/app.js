import express from 'express';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { guideRoutes } from './features/guides/routes.js';

const defaultDist = fileURLToPath(new URL('../dist/', import.meta.url));

export function createApp({ distDir = defaultDist, logger = console } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    next();
  });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/guides', guideRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));

  const publicPages = {
    '/guides': 'guides.html',
    '/privacy': 'privacy.html',
    '/terms': 'terms.html',
    '/contact': 'contact.html'
  };

  for (const [route, file] of Object.entries(publicPages)) {
    app.get(route, (_req, res, next) => {
      res.sendFile(join(distDir, file), error => {
        if (error?.code === 'ENOENT') {
          res.status(503).type('text').send('Website build missing. Run npm run build.');
        } else if (error) {
          next(error);
        }
      });
    });
    app.get(`${route}.html`, (_req, res) => res.redirect(308, route));
  }

  app.get('/', (_req, res, next) => {
    res.sendFile(join(distDir, 'index.html'), error => {
      if (error?.code === 'ENOENT') {
        res.status(503).type('text').send('Website build missing. Run npm run build.');
      } else if (error) {
        next(error);
      }
    });
  });
  app.use(express.static(distDir, { index: false, redirect: false }));
  app.use((_req, res) => res.status(404).type('text').send('Page not found.'));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status >= 400 && error.status < 500 ? error.status : 500;
    if (status === 500) logger.error(error);
    const message = status === 500 ? 'Internal server error.' : 'Invalid request.';
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      return res.status(status).json({ error: message });
    }
    res.status(status).type('text').send(message);
  });
  return app;
}
