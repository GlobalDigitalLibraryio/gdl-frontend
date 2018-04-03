// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
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
    color: colors.link.default,
    textDecoration: 'underline'
  }
};

// Using inline styles and no translation layer. Hopefully we'll always be able to show this page regardless of what thing throws an error
const UnexpectedError = () => (
  <div style={styles.container}>
    <div>
      <h1 style={styles.h1}>An unexpected error occurred!</h1>
      <h2 style={styles.h2}>
        We apologize and we will try our best to correct the issue.
      </h2>
      <a href="/" style={styles.a}>
        In the meantime, try going to the start page.
      </a>
    </div>
  </div>
);

export default UnexpectedError;
