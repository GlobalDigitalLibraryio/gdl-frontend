// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import defaultPage from '../hocs/defaultPage';
import { unsetToken, logout } from '../lib/auth/authHelpers';

class Logout extends React.Component<*> {
  componentDidMount() {
    unsetToken();
    logout();
  }

  render() {
    return null;
  }
}

export default defaultPage(Logout);
