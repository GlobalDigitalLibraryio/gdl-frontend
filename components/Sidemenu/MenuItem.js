// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';

const MenuItem = styled.a`
  font-size: 14px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;

  padding: 7px 15px;
  min-height: 38px;
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  transition: background-color 0.2s ease;
`;

export default MenuItem;
