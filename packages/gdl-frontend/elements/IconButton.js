// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { css, cx } from 'react-emotion';

type Props = {
  className?: string,
  label: React.Node,
  icon: React.Node,
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void
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
    <ButtonBase focusRipple className={cx(styles, className)} onClick={onClick}>
      {icon}
      <Typography variant="body1">{label}</Typography>
    </ButtonBase>
  );
};

const styles = css`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export default CustomButton;
