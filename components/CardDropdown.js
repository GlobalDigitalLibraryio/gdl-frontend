// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import Downshift from 'downshift';
import styled from 'styled-components';
import Card from './Card';

const CardDropdownItem = styled.a`
  display: block;
  padding: 10px 15px;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.grays.platinum};
  }
  & svg {
    margin-right: 10px;
  }
  ${props =>
    props.isActive && `background-color: ${props.theme.primaries.highlight}`};
`;

const Dropdown = Card.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.22), 0 20px 50px 0 rgba(0, 0, 0, 0.4);
  border-radius: 0 0 4px 4px;
  overflow: hidden;
  margin-top: 10px;
  position: absolute;
  left: 0;
`;

type Props = {
  id: string, // Because we want to avoid using Downshift's automatically generated id to prevent checksums errors with SSR
  renderTarget(getButtonProps: Function, isOpen: boolean): React.Node,
  children: ({
    highlightedIndex: number,
    getItemProps: ({ item: string }) => void,
  }) => React.ChildrenArray<React.Element<typeof CardDropdownItem>>,
};

const CardDropdown = (props: Props) => (
  <Downshift id={props.id}>
    {({
      getButtonProps,
      isOpen,
      getItemProps,
      highlightedIndex,
      selectedItem,
    }) => (
      <div>
        {props.renderTarget(getButtonProps, isOpen)}
        {isOpen && (
          <Dropdown style={{ width: '100%', zIndex: 999, padding: 0 }}>
            {props.children({
              getItemProps,
              selectedItem,
              highlightedIndex,
            })}
          </Dropdown>
        )}
      </div>
    )}
  </Downshift>
);

export { CardDropdown as default, CardDropdownItem };
