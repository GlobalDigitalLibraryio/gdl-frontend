// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';

// TODO: Fix text-shadow
const Button = styled.button`
  color: #fff;
  border-radius: 4px;
  background: linear-gradient(180deg, #5cbc80 0%, #359258 100%);
  line-height: 1.1;
  padding: 10px 30px;
  font-size: 1.4rem;
  font-weight: 600;
  min-width: 150px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  &:hover,
  &:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export default Button;
