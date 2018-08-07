// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

//const PORT = 3005;
const PORT = process.env['GDL_FRONTEND_PORT'] || 3005;

const initServer = require('./server');

initServer().then(server => {
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
