// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from '@emotion/styled';
import invariant from 'invariant';
import mq from '../style/mq';

type ResponsiveProp = string | [string, string];

export type Props = {
  children: ?Node,
  className?: string,
  alignItems?: 'center' | 'stretch',
  justifyContent?: 'space-between' | 'center',
  flexDirection?: 'row' | 'column',
  width?: ResponsiveProp,
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
  ${p =>
    mq({
      width: p.width,
      alignItems: p.alignItems,
      justifyContent: p.justifyContent,
      flexDirection: p.flexDirection,
      margin: p.m,
      marginTop: p.my || p.mt,
      marginBottom: p.my || p.mb,
      marginLeft: p.mx || p.ml,
      marginRight: p.mx || p.mr,
      padding: p.p,
      paddingTop: p.py || p.pt,
      paddingBottom: p.py || p.pb,
      paddingLeft: p.px || p.pl,
      paddingRight: p.px || p.pr,
      borderTop: p.borderTop,
      borderBottom: p.borderBottom
    })};
`;

export { StyledView };
export default View;
