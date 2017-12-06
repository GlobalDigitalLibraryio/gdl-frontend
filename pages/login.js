// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import defaultPage from '../hocs/defaultPage';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Meta from '../components/Meta';
import { loginSocialMedia } from '../lib/auth/authHelpers';

class LoginPage extends React.Component {
  render() {
    const { i18n } = this.props;

    return (
      <Layout>
        <Meta title={i18n.t`Login`} description={i18n.t`Login`} />
        <Container>
          <Trans>Login using</Trans>
          <p>
            <button onClick={() => loginSocialMedia('google-oauth2')}>
              Google
            </button>
          </p>
          <p>
            <button onClick={() => loginSocialMedia('facebook')}>
              Facebook
            </button>
          </p>
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(LoginPage);
