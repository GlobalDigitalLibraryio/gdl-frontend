// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import theme from 'styled-theming';
import styled, { css } from 'react-emotion';

import { colors } from '../style/theme';
import Text, { type Props as TextProps } from './Text';

type Props = {
  ...TextProps,
  openNewTab?: boolean
};

const A = ({ openNewTab, ...restProps }: Props) => {
  const props = {
    ...restProps
  };
  if (openNewTab) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return <StyledA {...props} />;
};

// Different colored links based on book category
const categoryColor = theme('category', {
  library: css`
    color: ${colors.link.default};
    &:hover {
      color: ${colors.link.defaultHover};
    }
  `,
  classroom: css`
    color: ${colors.link.alternate};
    &:hover {
      color: ${colors.link.alternateHover};
    }
  `
});

const StyledA = styled(Text)`
  ${categoryColor};
}`;

export default A;
