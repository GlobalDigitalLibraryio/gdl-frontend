// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';

const ReadingLevel = styled.span`
  border-radius: 12px;
  background-color: ${props => props.theme.grays.white};
  border: 1px solid ${props => props.theme.primaries.primary};
  color: ${props => props.theme.primaries.primary};
  font-weight: 600;
  font-size: 0.75rem;
  padding-left: 1.1em;
  padding-right: 1.1em;
  height: 4em;
  line-height: 2;
  text-transform: uppercase;
`;

export default ReadingLevel;
