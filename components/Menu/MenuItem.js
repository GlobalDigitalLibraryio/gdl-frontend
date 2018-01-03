// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'styled-components';
import theme from '../../style/theme';

const MenuItem = styled.a`
  font-size: 14px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;

  padding: 7px 15px;
  min-height: 38px;
  width: 100%;
  ${p => p.thinBorder && `border-bottom: 1px solid ${theme.colors.grayLight};`}
  ${p => p.thickBorder && `border-bottom: 2px solid ${theme.colors.grayLight};`}
`;

export default MenuItem;
