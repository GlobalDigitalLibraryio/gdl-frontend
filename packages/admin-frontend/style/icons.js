// @flow

import styled from '@emotion/styled';
import colors from './colors';

export const EditIconButton = styled('div')`
  color: ${colors.base.white};
  position: absolute;
  border: 0;
  top: 0;
  right: 0;
  padding: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;
