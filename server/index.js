// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const http = require('http');

const PORT = 3000;
const REDIRECT_PORT = 3001;

console.log(`> Ready on http://localhost:${PORT}`);

const redirectServer = http.createServer(require('./redirect'));

redirectServer.listen(REDIRECT_PORT);
redirectServer.on('listening', () => {
  console.log(
    `> Listening for insecure redirects on http://localhost:${REDIRECT_PORT}`
  );
});
