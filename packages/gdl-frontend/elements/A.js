// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Typography, type TypographyProps } from '@material-ui/core';
import { css, cx } from 'react-emotion';

type Props = {
  ...TypographyProps,
  openNewTab?: boolean
};

const A = ({ openNewTab, className, ...restProps }: Props) => {
  const props = {
    ...restProps
  };
  if (openNewTab) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return (
    <Typography
      component="a"
      color="primary"
      className={cx(style, className)}
      {...props}
    />
  );
};

const style = css`
  &:hover {
    text-decoration: underline;
  }
}`;

export default A;
