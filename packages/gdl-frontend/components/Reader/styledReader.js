// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';
import { fonts } from '../../style/theme';
import media from '../../style/media';

export const Page = styled.div`
  color: #000;
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
  font-family: ${fonts.family.book};
  br {
    display: none;
  }

  b {
    font-weight: ${fonts.weight.bold};
  }

  img {
    max-width: 100%;
    max-height: 66vh;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
  }
  &:first-child {
    margin-top: 0;
  }
  overflow-y: auto;
`;

// A grey backdrop that's only visible on tablets/desktops
export const Backdrop = styled.div`
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  z-index: -2;
  background-color: rgba(0, 0, 0, 0.7);
  ${media.mobile`
    display: none;
  `};
`;
