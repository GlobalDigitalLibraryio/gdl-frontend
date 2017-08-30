/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Control from '../Control';

const Button = styled.button`
  -moz-appearance: none;
  -webkit-appearance: none;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  box-shadow: none;
  display: inline-flex;
  font-size: 1rem;
  height: 2.25em;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  user-select: none;
  background-color: white;
  border-color: #dbdbdb;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding-left: 0.75em;
  padding-right: 0.75em;
  text-align: center;
  white-space: nowrap;

  &:focus {
    outline: none;
    border-color: #00d1b2;
    box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25);
    color: #363636;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: white;
    border-color: #dbdbdb;
    box-shadow: none;
    opacity: 0.5;
  }

  &:active {
    border-color: #4a4a4a;
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);
    color: #363636;
  }
`;

const ButtonContainer = (props, context) => {
  if (context.isInField) {
    return (
      <Control>
        <Button {...props} />
      </Control>
    );
  }
  return <Button {...props} />;
};

ButtonContainer.propTypes = {
  disabled: PropTypes.bool, // Disables the button
};

ButtonContainer.defaultProps = {
  type: 'button',
};

ButtonContainer.contextTypes = {
  isInField: PropTypes.bool,
};

export default ButtonContainer;
