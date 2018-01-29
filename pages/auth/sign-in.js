// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import type { I18n } from '../../types';
import Box from '../../components/Box';
import defaultPage from '../../hocs/defaultPage';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Head from '../../components/Head';
import H1 from '../../components/H1';
import { loginSocialMedia } from '../../lib/auth';
import Button from '../../components/Button';

const googleColor = '#db3236';
const facebookColor = '#3b5998';

type Props = {
  i18n: I18n
};

const LoginPage = ({ i18n }: Props) => (
  <Layout crumbs={[<Trans>Login</Trans>]}>
    <Head title={i18n.t`Login`} />
    <Container pt={50}>
      <Box textAlign="center">
        <H1>
          <Trans>Log in using</Trans>
        </H1>
        <p>
          <Button
            customColor={googleColor}
            onClick={() => loginSocialMedia('google-oauth2')}
          >
            Google
          </Button>
        </p>
        <p>
          <Button
            customColor={facebookColor}
            onClick={() => loginSocialMedia('facebook')}
          >
            Facebook
          </Button>
        </p>
      </Box>
    </Container>
  </Layout>
);

export default defaultPage(LoginPage);
