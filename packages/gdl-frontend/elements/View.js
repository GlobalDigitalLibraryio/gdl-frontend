// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from 'react-emotion';
import invariant from 'invariant';
import {
  alignItems,
  justifyContent,
  space,
  flexDirection,
  maxWidth,
  borders,
  width
} from 'styled-system';

type cssUnit = string | number;
type ResponsiveProp = cssUnit | [cssUnit, cssUnit];
type flexDirectionUnit = 'row' | 'column';
export type Props = {
  children: ?Node,
  className?: string,
  alignItems?: 'center' | 'stretch',
  justifyContent?: 'space-between' | 'center',
  flexDirection?: flexDirectionUnit | [flexDirectionUnit, flexDirectionUnit],
  width?: ResponsiveProp,
  maxWidth?: ResponsiveProp,
  m?: ResponsiveProp,
  mt?: ResponsiveProp,
  mb?: ResponsiveProp,
  ml?: ResponsiveProp,
  mr?: ResponsiveProp,
  mx?: ResponsiveProp,
  my?: ResponsiveProp,
  p?: ResponsiveProp,
  pt?: ResponsiveProp,
  pb?: ResponsiveProp,
  pl?: ResponsiveProp,
  pr?: ResponsiveProp,
  px?: ResponsiveProp,
  py?: ResponsiveProp,
  borderTop?: string,
  borderBottom?: string
};

const View = (props: Props) => {
  if (process.env.NODE_ENV !== 'production') {
    React.Children.toArray(props.children).forEach(item => {
      invariant(
        typeof item !== 'string',
        `Unexpected text node: ${item}. A text node cannot be a child of a <View>.`
      );
    });
  }

  return <StyledView {...props} />;
};

View.defaultProps = {
  alignItems: 'stretch'
};

const StyledView = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  /* fix flexbox bugs */
  min-height: 0;
  min-width: 0;
  ${maxWidth};
  ${alignItems};
  ${justifyContent};
  ${space};
  ${flexDirection};
  ${borders};
  ${width};
`;

export { StyledView };
export default View;
