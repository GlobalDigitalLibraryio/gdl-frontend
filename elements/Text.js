// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from 'react-emotion';
import { bool } from 'prop-types';
import {
  color,
  fontSize,
  fontWeight,
  textAlign,
  space,
  display
} from 'styled-system';
import { ellipsis } from 'polished';

import type { displayProperty } from './types';
import { fonts } from '../style/theme';

type cssUnit = string | number;
type ResponsiveProp = cssUnit | [cssUnit, cssUnit];

export type Props = {
  'aria-level'?: '1' | '2' | '3' | '4' | '5' | '6',
  accessibilityRole?: 'heading',
  children: ?Node,
  color?: string,
  display?: displayProperty | [displayProperty, displayProperty],
  fontSize?: string | Array<string>,
  fontWeight?: number,
  href?: string, // Will render as anchor tag
  onClick?: () => mixed, // Will render with a role of button and be focusable
  numberOfLines?: 1, // Currently we only support 1, because web
  textAlign?:
    | 'center'
    | 'inherit'
    | 'justify'
    | 'justify-all'
    | 'left'
    | 'start',
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
  py?: ResponsiveProp
};

class Text extends React.Component<Props> {
  static childContextTypes = {
    isInAParentText: bool
  };

  static contextTypes = {
    isInAParentText: bool
  };

  getChildContext() {
    return { isInAParentText: true };
  }

  // TODO: Fix the fact that stuff gets double clicked
  createEnterHandler(fn: (event: any) => mixed) {
    return (e: any) => {
      if (e.keyCode === 13) {
        fn && fn(e);
      }
    };
  }

  render() {
    const {
      accessibilityRole,
      'aria-level': ariaLevel,
      ...restProps
    } = this.props;

    const props = { ...restProps };

    if (props.href != null) {
      return <StyledAnchor {...props} />;
    } else if (props.onClick) {
      props.tabIndex = 0;
      props.onKeyDown = this.createEnterHandler(props.onClick);
      props.role = 'button';
    }

    if (accessibilityRole === 'heading') {
      const level = ariaLevel ? Number(ariaLevel) : 1; // Defaults to h1
      const Heading = StyledHeading[level];
      return <Heading {...props} />;
    }

    const { isInAParentText } = this.context;

    const Component = isInAParentText ? StyledSpan : StyledText;

    return <Component {...props} />;
  }
}

const StyledText = styled('div')`
  display: inline;
  margin: 0;
  padding: 0;
  line-height: ${fonts.lineHeight};
  ${p => p.numberOfLines === 1 && ellipsis()};
  ${display};
  ${fontSize};
  ${fontWeight};
  ${color};
  ${textAlign};
  ${space};
`;

const StyledSpan = StyledText.withComponent('span');
const StyledAnchor = StyledText.withComponent('a');

const StyledHeading = [];
StyledHeading[1] = StyledText.withComponent('h1');
StyledHeading[2] = StyledText.withComponent('h2');
StyledHeading[3] = StyledText.withComponent('h3');
StyledHeading[4] = StyledText.withComponent('h4');
StyledHeading[5] = StyledText.withComponent('h5');
StyledHeading[6] = StyledText.withComponent('h6');

export { StyledText };
export default Text;
