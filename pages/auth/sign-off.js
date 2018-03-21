// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import defaultPage from '../../hocs/defaultPage';
import { logout } from '../../lib/auth/';
import { unsetToken } from '../../lib/auth/token';

class SignOff extends React.Component<*> {
  componentDidMount() {
    unsetToken();
    logout();
  }

  render() {
    return null;
  }
}

export default defaultPage(SignOff);
