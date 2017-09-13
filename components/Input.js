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
  background-color: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #e8e3e3;
  padding: 12px;
  ${placeholder({ color: '#8A8888' })};
`;

export default Input;
