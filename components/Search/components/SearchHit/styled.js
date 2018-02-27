// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import theme from '../../../../style/theme';
import media from '../../../../style/media';

export const BookTitle = styled('h2')`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
  em {
    font-weight: 800;
    font-style: normal;
  }
`;

export const BookDescription = styled('p')`
  font-size: 0.9rem;
  line-height: 1.3rem;
  margin: 0;
  em {
    font-weight: bold;
  }
`;

export const BookLevel = styled('span')`
  display: block;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 500;
`;

export const Wrapper = styled('div')`
  :not(:last-child) {
    border-bottom: 1px solid ${theme.colors.grayLight};
  }
  display: flex;
  padding-bottom: 15px;
  :not(:first-child) {
    padding-top: 15px;
  }
  ${media.tablet`
    padding-bottom: 30px;
    :not(:first-child) {
      padding-top: 30px;
    }
  `};
`;

export const CoverWrap = styled('div')`
  flex: 0 0 80px;
  min-height: 108px;
  ${media.tablet`
    min-height: 158px;
  `};
`;

export const Div = styled('div')`
  margin-left: 15px;
`;
