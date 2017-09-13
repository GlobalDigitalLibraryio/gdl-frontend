// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import tag from 'tag-hoc';
import { fontSize } from 'styled-system';

const Base = tag(['textAlign'])('h1');

type Props = {
  textAlign: 'left' | 'center' | 'right',
};

type Test = (props: Props) => React.Component;

const Title: Test = styled(Base)`
  ${fontSize} font-weight: 600;
  text-align: ${props => props.textAlign};
`;

Title.defaultProps = {
  fontSize: [28, 38],
  textAlign: 'left',
};

export default Title;
