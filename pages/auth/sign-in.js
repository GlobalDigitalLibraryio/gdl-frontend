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
import { FaGoogle, FaFacebook } from 'react-icons/lib/fa';

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

const EqualWidthButtonsWrapper = styled('div')`
  display: inline-block;
  button {
    width: 100%;
    display: flex;
    margin-top: 30px;
  }
`;

const LoginPage = ({ i18n }: Props) => (
  <Layout crumbs={[<Trans>Login</Trans>]}>
    <Head title={i18n.t`Login`} />
    <Container pt={50}>
      <Box textAlign="center">
        <H1>
          <Trans>Log in to continue</Trans>
        </H1>
        <EqualWidthButtonsWrapper>
          <Button
            customColor={googleColor}
            onClick={() => loginSocialMedia('google-oauth2')}
          >
            <span>
              <FaGoogle /> <Trans>log in using Google</Trans>
            </span>
          </Button>
          <Button
            customColor={facebookColor}
            onClick={() => loginSocialMedia('facebook')}
          >
            <span>
              <FaFacebook /> <Trans>log in using Facebook</Trans>
            </span>
          </Button>
        </EqualWidthButtonsWrapper>
      </Box>
    </Container>
  </Layout>
);

export default defaultPage(LoginPage);
