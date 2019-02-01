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

const styles = {
  default: css`
    background: ${colors.container.background};
    flex: 1 0 auto;
    width: 100%;
    max-width: ${misc.containers.large}px;
    margin-left: auto;
    margin-right: auto;
  `,
  white: css`
    background: ${colors.base.white};
  `
};

type Props = {
  children: React.Node,
  className?: string,
  background?: 'white' | 'gray'
};

const Main = ({ background, ...props }: Props) => (
  <Paper
    css={[styles.default, background === 'white' && styles.white]}
    component="main"
    {...props}
  />
);

export default Main;
