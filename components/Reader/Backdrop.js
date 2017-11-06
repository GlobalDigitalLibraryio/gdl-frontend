// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'styled-components';
import media from '../helpers/media';

const Backdrop = styled.div`
  display: none;
  ${media.tablet`
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: fixed;
    z-index: -2;
    background-color: rgba(0, 0, 0, 0.5);
  `};
`;

export default Backdrop;
