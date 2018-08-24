// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css, cx } from 'react-emotion';
import { Paper } from '@material-ui/core';

import { misc, colors } from '../../style/theme';

const styles = {
  default: css`
    background: ${colors.container.background};
    flex: 1 0 auto;
    width: 100%;
    max-width: ${misc.containers.large};
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

const Main = ({ background, className, ...props }: Props) => (
  <Paper
    square
    className={cx(
      styles.default,
      { [styles.white]: background === 'white' },
      className
    )}
    component="main"
    {...props}
  />
);

export default Main;
