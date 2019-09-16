// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';
import { Paper } from '@material-ui/core';

import { misc, colors } from '../../style/theme';
import media from '../../style/media';

const styles = {
  default: css`
    flex: 1 0 auto;
    width: 100%;
    max-width: ${misc.containers.large}px;
    margin-left: auto;
    margin-right: auto;
  `,
  white: css`
    background: ${colors.base.white};
  `,
  container: css`
    margin-left: 0;
    ${media.largerTablet`
      margin-left: 90px;
      flex: 1 0 auto;
    `}
  `
};

type Props = {
  children: React.Node,
  className?: string,
  background?: 'white' | 'gray'
};

const Main = ({ background, children, className }: Props) => (
  <div css={styles.container}>
    <div
      css={[styles.default, background === 'white' && styles.white]}
      component="main"
      className={className}
    >
      {children}
    </div>
  </div>
);

export default Main;
