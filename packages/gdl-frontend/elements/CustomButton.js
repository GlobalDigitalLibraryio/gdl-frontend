// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { css } from 'react-emotion';

type Props = {};

const CustomButton = ({
  onClick,
  label,
  icon,
  isLoading,
  disabled,
  ...props
}: Props) => {
  return (
    <ButtonBase focusRipple className={styles.base} onClick={onClick}>
      {icon}
      <Typography variant="body1">{label}</Typography>
    </ButtonBase>
  );
};

const styles = {
  base: css`
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `
};

export default CustomButton;
