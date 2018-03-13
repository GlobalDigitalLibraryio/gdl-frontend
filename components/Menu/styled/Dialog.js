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

// Desktop menu width
const MENU_WIDTH = '375px';

export const FillScreen = styled('div')`
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 510;
  -webkit-overflow-scrolling: touch;
`;

export const Positioner = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 510;
  pointer-events: none;
  ${media.tablet`
    max-width: ${theme.containers.large};
    margin: auto;
  `};
`;

export const CenteredPositioner = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 510;
  pointer-events: none;
  ${media.tablet`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
  `};
`;

export const Dialog = styled('div')`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  outline: 0;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 0 2px 0 rgba(0, 0, 0, 0.12),
    0 4px 20px 0 rgba(0, 0, 0, 0.2);
  pointer-events: initial;
  ${media.tablet`
    margin-left: auto;
    width: ${MENU_WIDTH};
    height: 400px;
  `};
`;

export const CenteredDialog = styled(Dialog)`
  ${media.tablet`
    margin-left: unset;
  `};
`;

export const bodyCss = css`
  overflow: hidden;
  height: 100%;
  position: relative;
  #__next {
    overflow: hidden;
    height: 100%;
    position: relative;
  }
`;

export const htmlCss = css`
  height: 100%;
`;
