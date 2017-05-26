import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const A = styled.a`
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
  font-size: 1em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  justify-content: center;
  margin: 0.25rem;
  text-align: center;

  border-color: #dbdbdb;
  min-width: 2.25em;

  &:[disabled] {
    cursor: not-allowed;
    background-color: #dbdbdb;
    border-color: #dbdbdb;
    box-shadow: none;
    color: #7a7a7a;
    opacity: 0.5;
  }

  &:hover {
    border-color: #b5b5b5;
    color: #363636;
  }

  &:focus {
    border-color: #00d1b2;
  }

  &:active {
     box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);
  }
`;

const Li = styled.li`
  flex-grow: 1;
  flex-shrink: 1;
`;

const PaginationItem = props => (
  <Li>
    <A {...props} />
  </Li>
);

PaginationItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PaginationItem;
