// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { ButtonBase, CircularProgress, Typography } from '@material-ui/core';
import { css, cx } from 'react-emotion';

type Props = {
  className?: string,
  disabled?: boolean,
  isLoading?: boolean,
  label: React.Node,
  icon: React.Node,
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void | Promise<void>
};

const CustomButton = ({
  className,
  onClick,
  label,
  icon,
  isLoading,
  disabled,
  ...props
}: Props) => {
  return (
    <ButtonBase
      disabled={disabled || isLoading}
      focusRipple
      className={cx(styles, className)}
      onClick={onClick}
    >
      {isLoading ? <CircularProgress size={24} /> : icon}
      <Typography variant="body1" component="span">
        {label}
      </Typography>
    </ButtonBase>
  );
};

const styles = css`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export default CustomButton;
