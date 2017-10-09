// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import {
  fontSize,
  space,
  color,
  width,
  flex,
  responsiveStyle,
  textAlign,
} from 'styled-system';
import tag from 'tag-hoc';

const order = responsiveStyle('order');
const maxWidth = responsiveStyle('max-width', 'mw');
const maxHeight = responsiveStyle('max-height', 'mh');
const height = responsiveStyle('height', 'h');

// The inline array here is the list of props that are blacklisted, meaning they aren't passed to the DOM node
const Base = tag([
  'width',
  'w',
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
  'flex',
  'order',
  'wrap',
  'flexDirection',
  'align',
  'justify',
  'column',
  'mh',
  'mw',
  'h',
  'color',
  'bg',
  'align',
])('div');

const Box = styled(Base)`
  ${fontSize} ${width} ${space} ${flex} ${order} ${height} ${maxHeight} ${maxWidth} ${color} ${textAlign};
`;

export default Box;

/* TODO: Figure out how to Flow type styled components
type responsiveProp = string | number | Array<string> | Array<number>; 
type responsiveStringProp = string | Array<string>;

type Props = {
  fontSize: responsiveProp,

  width: responsiveProp,
  w: responsiveProp,
  m: responsiveProp,
  mt: responsiveProp,
  mr: responsiveProp,
  mb: responsiveProp,
  ml: responsiveProp,
  mx: responsiveProp,
  my: responsiveProp,

  p: responsiveProp,
  pt: responsiveProp,
  pr: responsiveProp,
  pb: responsiveProp,
  pl: responsiveProp,
  px: responsiveProp,
  py: responsiveProp,

  order: responsiveProp,
  flex: responsiveStringProp,

  is: string | React.Component

  mh: responsiveStringProp,
  mw: responsiveStringProp,
  h: responsiveStringProp,
  color: responsiveStringProp,
  bg: responsiveStringProp,
  align: responseStringProp,
} */
