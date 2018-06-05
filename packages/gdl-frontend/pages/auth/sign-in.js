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

import { withI18n, withMuiRoot } from '../../hocs';
import type { I18n } from '../../types';
import { A } from '../../elements';
import Container from '../../elements/Container';
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
  <Layout crumbs={[<Trans>Login</Trans>]}>
    <Head title={i18n.t`Login`} />
    <Container alignItems="center">
      <Typography variant="headline" mt={spacing.large}>
        <Trans>Log in to continue</Trans>
      </Typography>
      <div>
        <EqualWidthButtonsWrapper>
          <Button
            variant="raised"
            onClick={() => loginSocialMedia('google-oauth2')}
            css={{ color: googleColor }}
          >
            <Trans>Log in using Google</Trans>
          </Button>
          <Button
            variant="raised"
            onClick={() => loginSocialMedia('facebook')}
            css={{ color: facebookColor }}
          >
            <Trans>Log in using Facebook</Trans>
          </Button>
        </EqualWidthButtonsWrapper>
      </div>
      <Typography align="center" mt={spacing.xxlarge} paragraph>
        By logging in to this service I am hereby accepting the principles in
        the GDL{' '}
        <A href="https://home.digitallibrary.io/privacy/">privacy policy</A>,
        and I am giving my consent to GDL’s use of my personal information.
      </Typography>
    </Container>
  </Layout>
);

export default withMuiRoot(withI18n(LoginPage));
