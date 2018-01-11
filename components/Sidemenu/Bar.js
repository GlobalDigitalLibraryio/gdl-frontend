// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';
import theme from '../../style/theme';
import media from '../../style/media';

const Bar = styled.div`
  color: ${theme.colors.white};
  background-color: ${theme.colors.dark};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.22), 0 20px 50px 0 rgba(0, 0, 0, 0.4);
  width: 295px;
  height: 100%;
  z-index: 99;
  position: relative;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  a {
    color: inherit;
  }
  ${media.tablet`
    margin-left: auto;
  `};
`;

export default Bar;
