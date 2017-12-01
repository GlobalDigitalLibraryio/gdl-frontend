// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import media from '../style/media';
import theme from '../style/theme';

const ButtonLink = styled('a')`
  color: ${theme.colors.white};
  background: ${theme.colors.link};
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
  font-size: 16px;
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `};
`;

export default ButtonLink;
