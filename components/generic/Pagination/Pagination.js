/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import React from 'react';
import styled from 'styled-components';
import PaginationItem from './PaginationItem';

const Nav = styled.nav`
  font-size: 1rem;
  margin: -0.25rem;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Ul = styled.ul`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  list-style: none;
`;

const Pagination = props => (
  <Nav>
    <Ul {...props} />
  </Nav>
);

Pagination.Item = PaginationItem;

export default Pagination;
