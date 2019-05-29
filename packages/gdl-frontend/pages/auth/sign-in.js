// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from '@emotion/styled';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Button, Typography } from '@material-ui/core';
import { withRouter } from 'next/router';

import { logEvent } from '../../lib/analytics';
import { A, Container } from '../../elements';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { loginSocialMedia } from '../../lib/auth';
import { spacing } from '../../style/theme';

import type { IntlShape } from 'react-intl';

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

const translations = defineMessages({
  privacy: {
    id: 'privacy policy',
    defaultMessage: 'privacy policy'
  },
  firstPart: {
    id:
      'By signing in to this service I am hereby accepting the principles in the GDL',
    defaultMessage:
      'By signing in to this service I am hereby accepting the principles in the GDL'
  },
  lastPart: {
    id: 'and I am giving my consent to GDL’s use of my personal information',
    defaultMessage:
      'and I am giving my consent to GDL’s use of my personal information.'
  }
});

class LoginPage extends React.Component<{
  router: {
    query: {
      next?: string
    }
  },
  intl: IntlShape
}> {
  render() {
    const { intl } = this.props;
    return (
      <Layout>
        <Head
          title={intl.formatMessage({
            id: 'Sign in',
            defaultMessage: 'Sign in'
          })}
        />
        <Container alignItems="center">
          <Typography
            variant="h4"
            component="h1"
            align="center"
            css={{ marginTop: spacing.large }}
          >
            <FormattedMessage
              id="Sign in to continue"
              defaultMessage="Sign in to continue"
            />
          </Typography>
          <div>
            <EqualWidthButtonsWrapper>
              <Button
                variant="outlined"
                onClick={() => {
                  logEvent('User', 'Login', 'Google');
                  loginSocialMedia(
                    'google-oauth2',
                    this.props.router.query.next
                  );
                }}
                css={{ color: googleColor }}
              >
                <FormattedMessage
                  id="Sign in using Google"
                  defaultMessage="Sign in using Google"
                />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  logEvent('User', 'Login', 'Facebook');
                  loginSocialMedia('facebook', this.props.router.query.next);
                }}
                css={{ color: facebookColor }}
              >
                <FormattedMessage
                  id="Sign in using Facebook"
                  defaultMessage="Sign in using Facebook"
                />
              </Button>
            </EqualWidthButtonsWrapper>
          </div>
          <Typography
            align="center"
            css={{ marginTop: spacing.xxlarge }}
            paragraph
          >
            {`${intl.formatMessage(translations.firstPart)} `}
            <A
              href="https://home.digitallibrary.io/privacy/"
              css={{ display: 'inline' }}
            >
              {intl.formatMessage(translations.privacy)}
            </A>
            {`, ${intl.formatMessage(translations.lastPart)} `}
          </Typography>
        </Container>
      </Layout>
    );
  }
}

export default withRouter(injectIntl(LoginPage));
