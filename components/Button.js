// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import theme from '../style/theme';
import media from '../style/media';

const Button = styled.button`
  color: ${theme.colors.white};
  border-radius: 4px;
  background: linear-gradient(180deg, #5cbc80 0%, #359258 100%);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  min-height: 38px;
  font-size: 16px;
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `} font-weight: 500;
  line-height: 22px;
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  border-style: none;
  &:hover,
  &:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export default Button;
