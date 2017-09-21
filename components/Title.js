// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import tag from 'tag-hoc';
import { fontSize, color } from 'styled-system';

const Base = tag(['textAlign', 'upperCase'])('h1');

// TODO: Figure out how to type styled components
/* type Props = {
  textAlign: 'left' | 'center' | 'right',
  fontSize: Array<number> | number | Array<string> | string,
  color?: string,
  is?: string,
}; */

const Title = styled(Base)`
  ${fontSize} ${color} display: block;
  font-weight: 600;
  text-align: ${props => props.textAlign};
  text-transform: ${props => (props.upperCase ? 'uppercase' : null)};
  text-decoration: none;
`;

Title.defaultProps = {
  fontSize: [28, 38],
  textAlign: 'left',
};

export default Title;
