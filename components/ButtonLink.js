// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import media from '../style/media';
import theme from '../style/theme';

const buttonFragment = (color: string) => css`
  color: ${theme.colors.white};
  background: ${color};
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  border-radius: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  line-height: 22px;
  text-transform: uppercase;
  min-height: 38px;
  min-width: 210px;
  font-size: 16px;
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `};
  transition: all 0.15s ease-out;
  &:hover {
    transform: translateY(-1px);
    background: ${lighten(0.04, color)};
  }
`;

const ButtonLink = styled('a')`
  ${buttonFragment(theme.colors.link)};
`;

export { buttonFragment, ButtonLink as default };
