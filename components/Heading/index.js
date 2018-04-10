// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import styled, { css } from 'react-emotion';
import { fonts } from '../../style/theme';

type Props = {
  size: 1 | 2 | 3 | 4,
  children: Node
};

const base = css`
  margin: 0;
  &:not(:last-child) {
    margin-bottom: 0.5em;
  }
  font-weight: ${fonts.weight.normal};
  line-height: 1.3;
`;

const StyledHeading = [];

StyledHeading[1] = styled('h1')`
  ${base};
  font-size: 2.25rem;
`;

StyledHeading[2] = styled('h2')`
  ${base};
  font-size: 1.7rem;
  font-weight: ${fonts.weight.medium};
`;

StyledHeading[3] = styled('h3')`
  ${base};
  font-size: 1.13rem;
  font-weight: ${fonts.weight.bold};
`;

StyledHeading[4] = styled('h4')`
  ${base};
  font-size: 0.9rem;
  font-weight: ${fonts.weight.medium};
`;

const Heading = ({ size, children, ...props }: Props) => {
  const Component = StyledHeading[size];
  return <Component {...props}>{children}</Component>;
};

Heading.defaultProps = {
  size: 1
};

export default Heading;
export { StyledHeading };
