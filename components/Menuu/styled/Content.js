// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';

const BORDER_COLOR = '#e3e3e3';

/**
 * Wrapper around the entire modal content (header, body)
 */
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100vh;
`;

export const Body = styled('div')`
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const Title = styled('h4')`
  font-weight: 500;
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
`;

export const Item = styled('div')`
  font-size: 0.9rem;
  padding-left: 55px;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  font-weight: 500;
  position: relative;
  ${p => p.showKeyLine && `border-bottom: 1px solid ${BORDER_COLOR};`};
  ${p => p.isSelected && 'color: #00BA6E;'};
`;

export const ItemIcon = styled('span')`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
`;
