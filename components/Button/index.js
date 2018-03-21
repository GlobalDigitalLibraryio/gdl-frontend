// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { cx } from 'react-emotion';
import { Button, loadingStyle, buttonColor } from './styledButton';

type Props = {|
  children: Node,
  customColor?: string,
  href?: string,
  isLoading?: boolean,
  disabled?: boolean,
  target?: '_blank',
  rel?: 'noopener noreferrer',
  type?: 'submit' | 'reset' | 'button',
  onClick?: (
    event: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLAnchorElement>
  ) => any
|};

const A = Button.withComponent('a');

export default function({
  color,
  customColor,
  href,
  isLoading,
  ...props
}: Props) {
  const style = cx(
    { [loadingStyle]: isLoading },
    customColor && buttonColor(customColor)
  );

  return href == null ? (
    <Button className={style} type="button" {...props} />
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <A className={style} href={href} {...props} />
  );
}
