// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Trans, I18n } from '@lingui/react';
import { Button, Typography } from '@material-ui/core';
import { withRouter } from 'next/router';

import { setRedirectUrl } from 'gdl-auth';
import { logEvent } from '../../lib/analytics';
import { A, Container } from '../../elements';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { loginSocialMedia } from '../../lib/auth';
import { spacing } from '../../style/theme';

const googleColor = '#db3236';
const facebookColor = '#3b5998';

const EqualWidthButtonsWrapper = styled('div')`
  display: inline-block;
  button {
    width: 100%;
    display: flex;
    margin-top: ${spacing.large};
  }
`;

class LoginPage extends React.Component<{
  router: {
    query: {
      next?: string
    }
  }
}> {
  componentDidMount() {
    // Read from the quer parameters which place we would like to go after we've authenticated.
    // See securePage.js and signed-in.js
    const next = this.props.router.query.next;
    if (next) {
      setRedirectUrl(next);
    }
  }

  render() {
    return (
      <Layout>
        <I18n>{({ i18n }) => <Head title={i18n.t`Sign in`} />}</I18n>
        <Container alignItems="center">
          <Typography variant="headline" css={{ marginTop: spacing.large }}>
            <Trans>Sign in to continue</Trans>
          </Typography>
          <div>
            <EqualWidthButtonsWrapper>
              <Button
                variant="outlined"
                onClick={() => {
                  logEvent('User', 'Login', 'Google');
                  loginSocialMedia('google-oauth2');
                }}
                css={{ color: googleColor }}
              >
                <Trans>Sign in using Google</Trans>
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  logEvent('User', 'Login', 'Facebook');
                  loginSocialMedia('facebook');
                }}
                css={{ color: facebookColor }}
              >
                <Trans>Sign in using Facebook</Trans>
              </Button>
            </EqualWidthButtonsWrapper>
          </div>
          <Typography
            align="center"
            css={{ marginTop: spacing.xxlarge }}
            paragraph
          >
            By signing in to this service I am hereby accepting the principles
            in the GDL{' '}
            <A
              href="https://home.digitallibrary.io/privacy/"
              css={{ display: 'inline' }}
            >
              privacy policy
            </A>
            , and I am giving my consent to GDL’s use of my personal
            information.
          </Typography>
        </Container>
      </Layout>
    );
  }
}

export default withRouter(LoginPage);
