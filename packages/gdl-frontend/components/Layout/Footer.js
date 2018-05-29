// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import { css } from 'react-emotion';
import { Paper } from '@material-ui/core';

import config from '../../config';
import { Container } from '../../elements';
import { colors, spacing } from '../../style/theme';
import CreativeCommonsLogo from './cc-logo.svg';

const Footer = () => (
  <footer>
    <Container size="large" className={styles.container}>
      <Paper className={styles.paper} square>
        <CreativeCommonsLogo
          aria-label="Creative Commons"
          className={styles.ccLogo}
        />
        <div className={styles.links}>
          <a href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
            <Trans>Cookie policy</Trans>
          </a>
          <a href="https://home.digitallibrary.io/privacy/">
            <Trans>Privacy policy</Trans>
          </a>
          <a href={config.zendeskUrl}>
            <Trans>Report issues</Trans>
          </a>
          <a href="https://blog.digitallibrary.io/cc/">
            <Trans>Licensing and reuse</Trans>
          </a>
        </div>
      </Paper>
    </Container>
  </footer>
);

const styles = {
  paper: css`
    padding: ${spacing.xxlarge};
    background-color: ${colors.container.background};
  `,
  container: css`
    padding-left: 0;
    padding-right: 0;
  `,
  ccLogo: css`
    width: 40px;
  `,
  links: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: ${spacing.small};
    grid-column-gap: ${spacing.medium};
  `
};

export default Footer;
