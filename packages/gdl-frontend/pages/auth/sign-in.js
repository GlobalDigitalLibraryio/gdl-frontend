// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import { Button, Typography } from '@material-ui/core';

import { logEvent } from '../../lib/analytics';
import { withI18n } from '../../hocs';
import type { I18n } from '../../types';
import { A, Container } from '../../elements';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { loginSocialMedia } from '../../lib/auth';
import { spacing } from '../../style/theme';

const googleColor = '#db3236';
const facebookColor = '#3b5998';

type Props = {
  i18n: I18n
};

const EqualWidthButtonsWrapper = styled('div')`
  display: inline-block;
  button {
    width: 100%;
    display: flex;
    margin-top: ${spacing.large};
  }
`;

const LoginPage = ({ i18n }: Props) => (
  <Layout>
    <Head title={i18n.t`Sign in`} />
    <Container alignItems="center">
      <Typography variant="headline" css={{ marginTop: spacing.large }}>
        <Trans>Sign in to continue</Trans>
      </Typography>
      <div>
        <EqualWidthButtonsWrapper>
          <Button
            variant="outlined"
            onClick={() => {
              loginSocialMedia('google-oauth2');
              logEvent('User', 'Login', 'Google');
            }}
            css={{ color: googleColor }}
          >
            <Trans>Sign in using Google</Trans>
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              loginSocialMedia('facebook');
              logEvent('User', 'Login', 'Facebook');
            }}
            css={{ color: facebookColor }}
          >
            <Trans>Sign in using Facebook</Trans>
          </Button>
        </EqualWidthButtonsWrapper>
      </div>
      <Typography align="center" css={{ marginTop: spacing.xxlarge }} paragraph>
        By signing in to this service I am hereby accepting the principles in
        the GDL{' '}
        <A
          href="https://home.digitallibrary.io/privacy/"
          css={{ display: 'inline' }}
        >
          privacy policy
        </A>
        , and I am giving my consent to GDL’s use of my personal information.
      </Typography>
    </Container>
  </Layout>
);

export default withI18n(LoginPage);
