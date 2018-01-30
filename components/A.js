// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { css, cx } from 'react-emotion';
import theme from '../style/theme';

type Props = {
  className?: string,
  isBold?: boolean,
  isUppercased?: boolean,
  onClick?: (
    event: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLAnchorElement>
  ) => any
};

const style = css`
  font-size: inherit;
  border: none;
  background: transparent;
  &:hover {
    color: ${theme.colors.blues.dark};
  }
  &[disabled] {
    cursor: not-allowed;
    color: ${theme.colors.gray};
  }
`;

const uppcasedStyle = css`
  text-transform: uppercase;
`;

const boldStyle = css`
  font-weight: 500;
`;

/* eslint-disable jsx-a11y/anchor-has-content */
export default function({ isBold, isUppercased, className, ...props }: Props) {
  return (
    <a
      className={cx(
        style,
        { [uppcasedStyle]: isUppercased, [boldStyle]: isBold },
        className
      )}
      {...props}
    />
  );
}
