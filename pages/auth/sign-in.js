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
import type { I18n } from 'lingui-i18n';
import Box from '../../components/Box';
import defaultPage from '../../hocs/defaultPage';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import H1 from '../../components/H1';
import { loginSocialMedia } from '../../lib/auth';
import { buttonFragment } from '../../components/ButtonLink';

const GoogleButton = styled('button') `
  ${buttonFragment('#db3236')};
`;

const FacebookButton = styled('button') `
  ${buttonFragment('#3b5998')};
`;

type Props = {
  i18n: I18n,
};

const LoginPage = ({ i18n }: Props) => (
  <Layout>
    <Meta title={i18n.t`Login`} description={i18n.t`Login`} />
    <Container pt={50}>
      <Box textAlign="center">
        <Trans>
          <H1>Log in using</H1>
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

export default defaultPage(LoginPage);
