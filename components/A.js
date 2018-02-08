// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { css, cx } from 'react-emotion';
import rotate360 from '../style/rotate360';
import theme from '../style/theme';

type Props = {
  className?: string,
  isBold?: boolean,
  isUppercased?: boolean,
  isUnderlined?: boolean,
  isLoading?: boolean,
  href?: string,
  onClick?: (
    event: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLAnchorElement>
  ) => any
};

const style = css`
  font-size: inherit;
  border: none;
  background: transparent;
  color: ${theme.colors.link};
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

const underlineStyle = css`
  text-decoration: underline;
`;

const loadingStyle = css`
  color: transparent;
  text-shadow: none;
  position: relative;
  pointer-events: none;
  &:after {
    animation: ${rotate360} 500ms infinite linear;
    border: 2px solid ${theme.colors.dark};
    border-radius: 100px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    display: block;
    width: 0.8em;
    height: 0.8em;
    position: absolute;
    left: calc(50% - (0.8em / 2));
    top: calc(50% - (0.8em / 2));
  }
`;

/**
 * Renders anchor is href is passed, renders button if no href is passed
 */
export default function({
  isBold,
  isUppercased,
  isUnderlined,
  isLoading,
  className,
  href,
  ...props
}: Props) {
  const Elem = href != null ? 'a' : 'button';
  return (
    <Elem
      href={href}
      className={cx(
        style,
        {
          [uppcasedStyle]: isUppercased,
          [boldStyle]: isBold,
          [underlineStyle]: isUnderlined,
          [loadingStyle]: isLoading
        },
        className
      )}
      {...props}
    />
  );
}
