// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 @PROJECT@
 *
 * See LICENSE
 */

const PORT = 3000;

const initServer = require('./server');

initServer().then(server => {
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
