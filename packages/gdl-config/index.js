// @flow

// We use Flow comment types here, so we don't have to transpile this
// See https://flow.org/en/docs/types/comments/

/**
 * Use this constant in _document.js so the client is
 * configured with the same runtime environment as the server.
 */
const globalVarName /*: string */ = '__GDL_ENVIRONMENT__';

/**
 * Read the GDL environment from a global variable in the client (see _document.js)
 * On the server, we use environment variables.
 * Fallback to 'dev' if none is provided.
 */
const GDL_ENVIRONMENT /*: string */ = (function() {
  return (
    (typeof window !== 'undefined'
      ? window[globalVarName]
      : process.env.GDL_ENVIRONMENT) || 'dev'
  );
})();

module.exports = { GDL_ENVIRONMENT, globalVarName };
