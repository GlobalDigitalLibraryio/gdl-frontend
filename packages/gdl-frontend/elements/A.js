// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Typography } from '@material-ui/core';
import { css } from '@emotion/core';

type Props = {
  className?: string,
  openNewTab?: boolean
};

const A = ({ openNewTab, ...restProps }: Props) => {
  const props = {
    ...restProps
  };
  if (openNewTab) {
    // $FlowFixMe
    props.target = '_blank';
    // $FlowFixMe
    props.rel = 'noopener noreferrer';
  }
  return <Typography component="a" color="primary" css={style} {...props} />;
};

const style = css`
  &:hover {
    text-decoration: underline;
  }
}`;

export default A;
