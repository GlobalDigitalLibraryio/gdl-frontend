// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight } from 'react-icons/lib/md';
import { fontSize } from 'styled-system';

const Link = styled.a`
  ${fontSize} font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
`;

type Props = {
  children: React.Node,
};

const SimilarLink = (props: Props) => (
  <Link>
    {props.children} {MdKeyboardArrowRight}
  </Link>
);

SimilarLink.defaultProps = {
  fontSize: [18, 22],
};

export default SimilarLink;
