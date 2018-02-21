// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';

export const FillScreen = styled('div')`
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 100;
`;

export const Positioner = styled('div')`
  position: relative;
  /* margin: 60px auto; */
  /* fit-content is not supported in Edge */
  /* width: fit-content; */
  /* max-width: 600px; */
  z-index: 100;
`;

export const Dialog = styled('div')`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  outline: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;
