// @flow
import React from 'react';
import styled from '@emotion/styled';

type Value =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'baseline'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

type AlignValue =
  | 'normal'
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'baseline';

type JustifyValue = 'start' | 'end' | 'center' | 'stretch';

type AutoFlowValue = 'row' | 'column';

type Props = {
  autoFlow: AutoFlowValue,
  justifyContent?: Value,
  justifyItems?: JustifyValue,
  alignItems?: AlignValue,
  gridTemplateColumns?: string
};

const StyledRow = styled('div')`
  display: grid;
  grid-auto-flow: ${p => p.autoFlow};
  grid-gap: 1rem;
  ${p => p.justifyContent && `justify-content: ${p.justifyContent}`};
  ${p => p.alignItems && `align-items: ${p.alignItems}`};
  ${p => p.justifyItems && `justify-items: ${p.justifyItems}`};
  ${p =>
    p.gridTemplateColumns &&
    `grid-template-columns : ${p.gridTemplateColumns}`};
`;

const Row = (props: Props) => <StyledRow {...props} />;

Row.defaultProps = {
  autoFlow: 'column'
};

export default Row;
