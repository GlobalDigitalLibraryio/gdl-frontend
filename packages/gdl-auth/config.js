const { GDL_ENVIRONMENT } = require('gdl-config');

function getConfig() {
  const config = {
    common: {
      clientAuth: {
        clientId: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
        audience: 'gdl_system',
        domain: 'digitallibrary.eu.auth0.com'
      }
    }
  };

  return {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[GDL_ENVIRONMENT]
  };
}

module.exports = getConfig();
