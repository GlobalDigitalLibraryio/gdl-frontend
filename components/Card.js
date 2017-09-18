// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import { fontSize } from 'styled-system';
import Box from './Box';

const Card = Box.extend`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  max-width: 100%;

  & hr {
    background-color: #e8e3e3;
    height: 1px;
    border: none;
  }
`;

Card.defaultProps = {
  px: 15,
  py: 12,
};

// Adds much bigger shadow to the card
// TODO: Add Flow typing of children
const CardDropdown = Card.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.22), 0 20px 50px 0 rgba(0, 0, 0, 0.4);
  &::before,
  &::after {
    bottom: 100%;
    left: 10%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &::after {
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px;
  }
  &::before {
    border-color: rgba(194, 225, 245, 0);
    border-bottom-color: rgba(0, 0, 0, 0.22);
    border-width: 11px;
    margin-left: -11px;
  }
`;

CardDropdown.defaultProps = {
  w: 0.95,
  mx: 'auto',
  mt: 10,
};

// Currently we only support links in the dropdown
const CardDropdownItem = styled.a`
  display: block;
  color: #20588f;
  text-decoration: none;
  padding: 10px 15px;

  & svg {
    margin-right: 10px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e8e3e3;
  }
`;

// The data selectors is for popper.js
const CardPopoverArrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  [data-placement^='bottom'] & {
    top: -10px;
    left: calc(50% - 5px);
    border-width: 5px 5px 0 5px;
    border-color: transparent transparent #222 transparent;
  }
`;

const CardAction = styled.a`
  ${fontSize} color: #20588f;
  text-decoration: none;
  font-weight: 600;
`;

CardAction.defaultProps = {
  fontSize: 16,
};

export {
  Card as default,
  CardAction,
  CardDropdown,
  CardDropdownItem,
  CardPopoverArrow,
};
