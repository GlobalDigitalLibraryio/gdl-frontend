// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';

const ReadingLevel = styled.span`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 39px;
  background-color: ${props => props.theme.supports.greenHighlight};
  color: ${props => props.theme.supports.greenDark};
  padding-left: 10px;
  padding-right: 10px;
`;

export default ReadingLevel;
