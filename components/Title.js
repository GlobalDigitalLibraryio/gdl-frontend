// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import tag from 'tag-hoc';
import { fontSize, color, textAlign } from 'styled-system';

const Base = tag(['align', 'upperCase'])('h1');

// TODO: Figure out how to type styled components
/* type Props = {
  text: 'left' | 'center' | 'right',
  fontSize: Array<number> | number | Array<string> | string,
  color?: string,
  is?: string,
}; */

const Title = styled(Base)`
  ${fontSize} ${color} ${textAlign} display: block;
  margin-top: 0;
  font-weight: 600;
  text-transform: ${props => (props.upperCase ? 'uppercase' : null)};
`;

Title.defaultProps = {
  fontSize: [28, 38],
};

export default Title;
