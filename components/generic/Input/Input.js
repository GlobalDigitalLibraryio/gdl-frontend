import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Control from '../Control';

// Pull out most css for input. If we ever get a Textarea component, all of these styles apply to it as well
const common = css`
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
  background-color: white;
  border-color: #dbdbdb;
  color: #363636;
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  max-width: 100%;
  width: 100%;

  &:hover {
    border-color: #b5b5b5;
  }

  &::placeholder {
    color: rgba(54, 54, 54, 0.3);
  }

  &:focus,
  &:active {
    outline: none;
    border-color: #00d1b2;
  }

  &:[disabled] {
    cursor: not-allowed;
    background-color: whitesmoke;
    border-color: whitesmoke;
    box-shadow: none;
    color: #7a7a7a;
  }
`;

const Input = styled.input`${common};`;

const InputContainer = ({ expanded, ...props }) => (
  <Control expanded={expanded}>
    <Input {...props} />
  </Control>
);

InputContainer.propTypes = {
  expanded: PropTypes.bool,
  disabled: PropTypes.bool
};

InputContainer.defaultProps = {
  expanded: false,
  type: 'text'
};

export default InputContainer;
