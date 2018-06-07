// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Button, CircularProgress, type ButtonProps } from '@material-ui/core';
import { css } from 'react-emotion';
import DelayedLoading from './DelayedLoading';

type Props = {
  ...ButtonProps,
  isLoading: boolean
};

const LoadingButton = ({ children, isLoading, disabled, ...props }: Props) => {
  return (
    <DelayedLoading loading={isLoading}>
      {({ loading }) => (
        <Button disabled={disabled || isLoading} {...props}>
          {children}
          {loading && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </Button>
      )}
    </DelayedLoading>
  );
};

const styles = {
  progress: css`
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -12px;
    margin-top: -12px;
  `
};

export default LoadingButton;
