// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { withOnlineStatusContext } from '../OnlineStatusContext';
import { colors } from '../../style/theme';

const styles = {
  container: {
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  h1: {
    fontWeight: '500',
    margin: '0',
    padding: '0',
    marginBottom: '10px',
    fontSize: '24px'
  },
  h2: {
    fontSize: '16px',
    padding: '0',
    margin: '0',
    marginBottom: '30px',
    fontWeight: 'normal'
  },
  a: {
    color: colors.default,
    textDecoration: 'underline'
  }
};

const translations = defineMessages({
  online: {
    id: 'In the meantime, try going to the start page',
    defaultMessage: 'In the meantime, try going to the start page.'
  },
  offline: {
    id: 'View your offline library',
    defaultMessage: 'View your offline library.'
  },
  header: {
    id: 'An unexpected error occurred!',
    defaultMessage: 'An unexpected error occurred!'
  },
  text: {
    id: 'We apologize and we will try our best to correct the issue',
    defaultMessage:
      'We apologize and we will try our best to correct the issue.'
  }
});

type Props = {
  online?: boolean,
  intl: intlShape
};

// Using inline styles and no translation layer. Hopefully we'll always be able to show this page regardless of what thing throws an error
const UnexpectedError = ({ online, intl }: Props) => (
  <div style={styles.container}>
    <div>
      <h1 style={styles.h1}>{intl.formatMessage(translations.header)}</h1>
      <h2 style={styles.h2}>{intl.formatMessage(translations.text)}</h2>
      {online ? (
        <a href="/" style={styles.a}>
          {intl.formatMessage(translations.online)}
        </a>
      ) : (
        <a href="/offline" style={styles.a}>
          {intl.formatMessage(translations.offline)}
        </a>
      )}
    </div>
  </div>
);

export default withOnlineStatusContext(injectIntl(UnexpectedError));
