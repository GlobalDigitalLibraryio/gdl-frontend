// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import styled, { css } from 'react-emotion';
import { fonts, colors } from '../../../style/theme';

const BORDER_COLOR = colors.base.grayLight;

/**
 * Wrapper around the entire modal content (header, body)
 * The min-height: 0 on the wrapper fixes overflow in Firefox: See https://moduscreate.com/blog/how-to-fix-overflow-issues-in-css-flex-layouts/
 */
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100vh;
  min-height: 0;
`;

export const Body = styled('div')`
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const Title = styled('h1')`
  font-weight: ${fonts.weight.medium};
  font-size: 1rem;
  margin: 0;
  display: flex;
`;

export const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem 1rem;
  border-bottom: 1px solid ${BORDER_COLOR};
`;

export const Button = styled('button')`
  background: transparent;
  border: none;
  &:first-of-type {
    padding-left: 0;
  }
  &:last-of-type {
    padding-right: 0;
  }
`;

export const Item = styled('div')`
  display: block;
  color: inherit;
  font-size: 0.9rem;
  padding-left: 55px;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  font-weight: ${fonts.weight.medium};
  position: relative;
  ${p => p.showKeyLine && `border-bottom: 1px solid ${BORDER_COLOR};`};
  ${p => p.isNestedItem && `padding-left: 70px;`};
`;

export const itemActionStyle = css`
  &:hover {
    background-color: #f8f8f8;
  }
  cursor: pointer;
`;

export const ItemIcon = styled('span')`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.isSelected && `color: ${colors.base.green};`};
`;
