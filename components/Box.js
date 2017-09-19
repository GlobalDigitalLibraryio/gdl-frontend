// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import { fontSize, space, width, responsiveStyle } from 'styled-system';
import tag from 'tag-hoc';

const flex = responsiveStyle('flex');
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
  'direction',
  'align',
  'justify',
  'column',
  'mh',
  'mw',
  'h',
])('div');

// $FlowFixMe Doesn't typecheck against styled-components from flow-typed
const Box = styled(Base)(
  [],
  fontSize,
  width,
  space,
  flex,
  order,
  height,
  maxHeight,
  maxWidth,
);

Box.displayName = 'Box';

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
} */
