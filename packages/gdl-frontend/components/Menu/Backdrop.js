// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import styled from 'react-emotion';

/**
 * Backdrop/Blanket component to use behind modals etc.
 */

type Props = {
  onClick: (event: SyntheticMouseEvent<any>) => void,
  isTinted?: boolean
};

const StyledBackdrop = styled('div')`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 500;
  pointer-events: initial;
  ${p => p.isTinted && `background-color: rgba(10, 10, 10, 0.3);`};
`;

const Backdrop = (props: Props) => <StyledBackdrop {...props} />;

export default Backdrop;