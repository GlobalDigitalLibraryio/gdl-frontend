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
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaGoogle from 'react-icons/lib/fa/google';

import type { I18n } from '../../types';
import { Text, A } from '../../elements';
import Container from '../../elements/Container';
import defaultPage from '../../hocs/defaultPage';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { loginSocialMedia } from '../../lib/auth';
import Button from '../../components/Button';
import { fonts, spacing } from '../../style/theme';

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
      <Text
        accessibilityRole="heading"
        fontWeight={fonts.weight.medium}
        mt={spacing.large}
      >
        <Trans>Log in to continue</Trans>
      </Text>
      <div>
        <EqualWidthButtonsWrapper>
          <Button
            customColor={googleColor}
            onClick={() => loginSocialMedia('google-oauth2')}
          >
            <span>
              <FaGoogle /> <Trans>Log in using Google</Trans>
            </span>
          </Button>
          <Button
            customColor={facebookColor}
            onClick={() => loginSocialMedia('facebook')}
          >
            <span>
              <FaFacebook /> <Trans>Log in using Facebook</Trans>
            </span>
          </Button>
        </EqualWidthButtonsWrapper>
      </div>
      <Text textAlign="center" fontSize="0.8rem" mt={spacing.xxlarge}>
        By logging in to this service I am hereby accepting the principles in
        the GDL{' '}
        <A href="https://home.digitallibrary.io/privacy/">privacy policy</A>,
        and I am giving my consent to GDL’s use of my personal information.
      </Text>
    </Container>
  </Layout>
);

export default defaultPage(LoginPage);
