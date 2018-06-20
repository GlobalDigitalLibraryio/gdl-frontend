// @flow
import { GDL_ENVIRONMENT } from 'gdl-config';

export default {
  readAdmin: `admin-${GDL_ENVIRONMENT}:read`,
  writeBook: `books-${GDL_ENVIRONMENT}:write`,
  writeImage: `images-${GDL_ENVIRONMENT}:write`
};
