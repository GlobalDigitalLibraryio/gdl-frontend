import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { PRIMARY } from '../../colors';

const common = css`
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
  min-width: 2.25em;
  text-decoration: none;
`;

const A = styled.a`
  ${common}
  border-color: #dbdbdb;

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus {
    border-color: #00d1b2;
  }

  &:active {
     box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);
  }

  ${props => (props.active ? `
    background-color: ${PRIMARY};
    color: #fff;
    &:hover {
      color: #fff;
    }
  ` : null)}
`;

const Ellipsis = styled.span`
  ${common}
  color: #b5b5b5;
  pointer-events: none;
`;

const Li = styled.li`
  flex-grow: 1;
  flex-shrink: 1;
`;

const PaginationItem = ({ ellipsis, ...props }) => (
  <Li>
    {ellipsis ? <Ellipsis>…</Ellipsis> : <A {...props} />}
  </Li>
);

PaginationItem.propTypes = {
  active: PropTypes.bool,
  ellipsis: PropTypes.bool,
};

export default PaginationItem;
