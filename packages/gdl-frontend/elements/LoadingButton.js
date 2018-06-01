// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { css } from 'react-emotion';

type Props = {
  isLoading: boolean
};

const LoadingButton = ({ isLoading, disabled, ...props }: Props) => {
  return (
    <div className={styles.wrapper}>
      <Button disabled={disabled || isLoading} {...props} />
      {isLoading && <CircularProgress size={24} className={styles.progress} />}
    </div>
  );
};

const styles = {
  wrapper: css`
    position: relative;
  `,
  progress: css`
    position: absolute;
    top: 50%;
    left: 50%;
  `
};

export default LoadingButton;
