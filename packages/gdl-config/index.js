// @flow

/**
 * Use this constant in _document.js so the client is
 * configured with the same runtime environment as the server.
 */
const globalVarName = '__GDL_ENVIRONMENT__';

/**
 * Read the GDL environment from a global variable in the client (see _document.js)
 * On the server, we use environment variables.
 * Fallback to 'dev' if none is provided.
 */
const GDL_ENVIRONMENT: string = (function() {
  return (
    (typeof window !== 'undefined'
      ? window[globalVarName]
      : process.env.GDL_ENVIRONMENT) || 'dev'
  );
})();

export { GDL_ENVIRONMENT, globalVarName };
