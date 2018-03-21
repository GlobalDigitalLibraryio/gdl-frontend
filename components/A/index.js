// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { cx } from 'react-emotion';
import {
  A,
  uppcasedStyle,
  boldStyle,
  underlineStyle,
  loadingStyle
} from './styledA';

type Props = {|
  'aria-expanded'?: boolean,
  children: Node,
  className?: string,
  disabled?: boolean,
  isBold?: boolean,
  isUppercased?: boolean,
  isUnderlined?: boolean,
  isLoading?: boolean,
  href?: string,
  target?: '_blank',
  rel?: 'noopener noreferrer',
  style?: {},
  onClick?: (
    event: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLAnchorElement>
  ) => any
|};

const Button = A.withComponent('button');

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
  const Elem = href != null ? A : Button;
  return (
    <Elem
      href={href}
      className={cx(
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
