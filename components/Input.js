// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import { placeholder } from 'polished';
import styled from 'styled-components';

const Input = styled.input`
  font-size: 1rem;
  background-color: ${props => props.theme.grays.desertStorm};
  border-radius: 4px;
  border: 5px solid ${props => props.theme.primaries.tertiary};
  padding: 12px;
  ${placeholder({ color: '#8A8888' })};
  &:focus {
    box-shadow: inset 0 3px 4px 0 rgba(0, 0, 0, 0.2);
  }
`;

export default Input;
