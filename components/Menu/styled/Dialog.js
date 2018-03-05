// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import styled, { css } from 'react-emotion';
import theme from '../../../style/theme';
import media from '../../../style/media';

export const FillScreen = styled('div')`
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 100;
  -webkit-overflow-scrolling: touch;
`;

export const Positioner = styled('div')`
  position: relative;
  z-index: 100;
  ${media.tablet`
    max-width: ${theme.containers.large};
    margin-left: auto;
    margin-right: auto;
  `};
`;

export const Dialog = styled('div')`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  outline: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  ${media.tablet`
    max-width: 375px;
    margin-left: auto;
    height: 400px;
  `};
`;

export const bodyCss = css`
  overflow: hidden;
  height: 100%;
  #__next {
    overflow: hidden;
    height: 100%;
  }
`;

/* margin: 60px auto; */
/* fit-content is not supported in Edge */
/* width: fit-content; */
/* max-width: 600px; */
