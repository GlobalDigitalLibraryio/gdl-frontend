// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { cx, css } from 'react-emotion';
import { lighten } from 'polished';
import rotate360 from '../style/rotate360';
import media from '../style/media';
import theme from '../style/theme';

type Props = {
  color?: 'link' | 'green',
  customColor?: string,
  href?: string,
  className?: string,
  isLoading?: boolean,
  disabled?: boolean,
  type?: 'submit' | 'reset' | 'button',
  onClick?: (
    event: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLAnchorElement>
  ) => any
};

const buttonStyle = (color: string) => css`
  color: ${theme.colors.white};
  background: ${color};
  border-style: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  border-radius: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 210px;
  line-height: 22px;
  text-transform: uppercase;
  min-height: 38px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 16px;
  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `};
  transition: transform 0.15s ease-out, background 0.15s ease-out;
  &:hover:not([disabled]) {
    transform: translateY(-1px);
    background: ${lighten(0.04, color)};
  }
`;

const loadingStyle = css`
  color: transparent;
  text-shadow: none;
  position: relative;
  pointer-events: none;
  &:after {
    animation: ${rotate360} 500ms infinite linear;
    border: 2px solid ${theme.colors.white};
    border-radius: 100px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    display: block;
    width: 1em;
    height: 1em;
    position: absolute;
    left: calc(50% - (1em / 2));
    top: calc(50% - (1em / 2));
  }
`;

export default function({
  color,
  customColor,
  href,
  isLoading,
  className,
  ...props
}: Props) {
  // customColor takes precedence of the color prop
  const bgColor =
    customColor ||
    (color === 'green' ? theme.colors.greens.dark : theme.colors.link);

  const style = cx(
    buttonStyle(bgColor),
    { [loadingStyle]: isLoading },
    className
  );

  return href == null ? (
    <button className={style} type="button" {...props} />
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className={style} href={href} {...props} />
  );
}
