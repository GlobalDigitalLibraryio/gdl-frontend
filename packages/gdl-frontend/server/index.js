/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const express = require('express');
const Sentry = require('@sentry/node');
const helmet = require('helmet');
const next = require('next');
const requestLanguage = require('express-request-language');
const cookieParser = require('cookie-parser');
const { GDL_ENVIRONMENT } = require('gdl-config');
const glob = require('glob');
const csp = require('helmet-csp');
const { join } = require('path');
const axios = require('axios');

const routes = require('../routes');
const {
  publicRuntimeConfig: {
    REPORT_ERRORS,
    SENTRY_PUBLIC_KEY,
    SENTRY_PROJECT_ID,
    siteTranslationServiceUrl,
    DEFAULT_LANGUAGE
  },
  serverRuntimeConfig: { port }
} = require('../config');
const contentSecurityPolicy = require('./contentSecurityPolicy');

const defaultLangTranslations = require('../locale/en/en.json');
const languages = glob.sync('locale/*/en.json').map(f => f.split('/')[1]);
console.log('> Found translations for the following languages: ', languages);
console.log('> GDL environment: ', GDL_ENVIRONMENT);
console.log('> Will report errors: ', REPORT_ERRORS);

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });

// Setup cache for rendered HTML
const renderAndCache = require('./cache')(app);

// Use cache and next-routes for custom routing
const handle = routes.getRequestHandler(
  app,
  async ({ req, res, route, query }) => {
    // We set precedence for how we get, and sets site language
    const siteLang =
      query.lang || req.cookies['siteLanguage'] || DEFAULT_LANGUAGE.code;
    req.localeCatalog = await getLanguageCatalog(siteLang);
    req.siteLang = siteLang;
    renderAndCache(req, res, route.page, query);
  }
);

// We need to expose React Intl's locale data on the request for the user's
const getLanguageCatalog = async language => {
  const translation = await axios(`${siteTranslationServiceUrl}/${language}`)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      const { data, status, statusText } = error.response;
      console.error({ data, status, statusText });
      return { en: defaultLangTranslations };
    });
  return translation[language];
};

app.prepare().then(() => {
  const server = express();

  if (isDev) {
    app.setAssetPrefix(`http://localhost:${port}`);
  } else {
    if (REPORT_ERRORS) {
      Sentry.init({
        release: 'next-branch',
        dsn: `https://${SENTRY_PUBLIC_KEY}@sentry.io/${SENTRY_PROJECT_ID}`,
        environment: GDL_ENVIRONMENT
      });
      // The request handler must be the first middleware on the app
      server.use(Sentry.Handlers.requestHandler());
      // The error handler must be before any other error middleware
      server.use(Sentry.Handlers.errorHandler());
    }
    // Security setup if we're not running in development mode
    server.use(
      helmet({
        contentSecurityPolicy: {
          directives: contentSecurityPolicy.normalDirectives
        },
        frameguard: { action: 'allow-from', domain: '*://freelearning.io' }
      })
    );
  }

  // Health check for AWS
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 200, text: 'Health check ok' });
  });

  // Serve service worker from root of site so it applies to all pages
  // We have different CSP directives for the service worker, sicne a service worker is essentially a script
  // See https://qubyte.codes/blog/content-security-policy-and-service-workers
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get(
    '/service-worker.js',
    csp({ directives: contentSecurityPolicy.serviceWorkerDirectives }),
    (req, res) => {
      const filePath = join(app.distDir, 'service-worker.js');
      res.sendFile(filePath);
    }
  );

  // Serve the generated precache manifest for the service worker
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('/precache-manifest.:buildId.js', (req, res) => {
    const filePath = join(app.distDir, req.url);
    res.sendFile(filePath);
  });

  // Setup the cookie parsing for express
  server.use(cookieParser());
  // Determine language based on query parameter, cookie, or http accept header
  // This middleware injects a language property on the request object.
  server.use(
    requestLanguage({
      languages,
      queryName: 'hl',
      cookie: {
        name: 'language'
      }
    })
  );

  server.use(handle);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
