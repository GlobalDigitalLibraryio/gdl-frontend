// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import styled from 'react-emotion';

import View from './View';
import { misc, spacing } from '../style/theme';

/**
 * Center content horizontally
 */
const StyledContainer = styled(View)`
  margin: 0 auto;
  max-width: ${p => misc.containers[p.size]};
  padding-left: ${spacing.medium};
  padding-right: ${spacing.medium};
`;

type Props = {
  size: $Keys<typeof misc.containers>
};

const Container = (props: Props) => <StyledContainer {...props} />;

Container.defaultProps = {
  size: 'small'
};

export default Container;