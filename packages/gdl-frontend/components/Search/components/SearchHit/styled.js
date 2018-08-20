// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { colors, fonts } from '../../../../style/theme';
import media from '../../../../style/media';

export const BookTitle = styled('h2')`
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 0.35rem;
  font-weight: ${fonts.weight.medium};
  em {
    font-weight: ${fonts.weight.bold};
    font-style: normal;
  }
`;

export const BookDescription = styled('p')`
  font-size: 0.9rem;
  line-height: 1.3rem;
  margin: 0;
  margin-bottom: 0.35rem;
  em {
    font-weight: ${fonts.weight.bold};
    font-style: normal;
  }
`;

export const Wrapper = styled('div')`
  :not(:last-child) {
    border-bottom: 1px solid ${colors.base.grayLight};
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

export const Divider = styled('span')`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  border-left-width: 1px;
  border-left-style: solid;
  border-color: currentColor;
`;
