// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { Trans } from 'lingui-react';
import Box from '../components/Box';
import defaultPage from '../hocs/defaultPage';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Meta from '../components/Meta';
import H1 from '../components/H1';
import { loginSocialMedia } from '../lib/auth/authHelpers';
import { buttonFragment } from '../components/ButtonLink';

const GoogleButton = styled('button')`
  ${buttonFragment('#db3236')};
`;

const FacebookButton = styled('button')`
  ${buttonFragment('#3b5998')};
`;

class LoginPage extends React.Component {
  render() {
    const { i18n } = this.props;

    return (
      <Layout>
        <Meta title={i18n.t`Login`} description={i18n.t`Login`} />
        <Container pt={50}>
          <Box textAlign="center">
            <Trans>
              <H1>Login using</H1>
            </Trans>
            <p>
              <GoogleButton onClick={() => loginSocialMedia('google-oauth2')}>
                Google
              </GoogleButton>
            </p>
            <p>
              <FacebookButton onClick={() => loginSocialMedia('facebook')}>
                Facebook
              </FacebookButton>
            </p>
          </Box>
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(LoginPage);
