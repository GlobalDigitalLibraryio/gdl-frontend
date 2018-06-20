// @flow
import { GDL_ENVIRONMENT } from 'gdl-config';

// If we'e running locally, we're probably developing and using the test environment APIs
// So for the purpose of checking user access, we use 'test', otherwise we can't access anything...
const ENV = GDL_ENVIRONMENT === 'dev' ? 'test' : GDL_ENVIRONMENT;

export default {
  readAdmin: `admin-${ENV}:read`,
  writeBook: `books-${ENV}:write`,
  writeImage: `images-${ENV}:write`
};
