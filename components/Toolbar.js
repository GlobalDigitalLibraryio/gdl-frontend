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
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/lib/md';
import Card from './Card';

const Toolbar = styled.div`
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-size: 14px;
  position: relative;
`;

const Item = styled.div`
  border-right: solid 1px #e0e0e0;
  &:first-child {
    border-left: solid 1px #e0e0e0;
  }
  position: relative;
  display: inline-block;
`;

const A = styled.a`
  padding: 10px 15px;
  display: block;
`;

const ToolbarDropdownItem = styled.a`
  display: block;
  padding: 10px 15px;
  color: #444;
  &:not(:last-child) {
    border-bottom: 1px solid #e8e3e3;
  }

  & svg {
    color: ${props => (props.isSelected ? '#5CBC80' : '#dddddd')};
    margin-right: 10px;
  }

  ${props => props.isActive && 'background-color: #edf7ff'};
  ${props => props.isSelected && 'background-color: #EDFFF4'};
`;

type Props = {
  id: string, // Because we want to avoid using Downshift's automatically generated id to prevent checksums errors with SSR
  text: string,
  children: ({
    selectedItem: ?string,
    highlightedIndex: number,
    getItemProps: ({ item: string }) => void,
  }) => React.ChildrenArray<React.Element<typeof ToolbarDropdownItem>>,
  selectedItem: ?string,
};

class ToolbarItem extends React.Component<Props, { isExpanded: boolean }> {
  state = {
    isExpanded: false,
  };

  render() {
    return (
      <Downshift selectedItem={this.props.selectedItem}>
        {({
          getButtonProps,
          getRootProps,
          isOpen,
          getItemProps,
          highlightedIndex,
          selectedItem,
        }) => (
          <Item {...getRootProps({ refKey: 'innerRef' })}>
            <A href="" {...getButtonProps()}>
              {this.props.text}{' '}
              {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </A>
            {isOpen && (
              <Card
                px={0}
                py={0}
                mt="1px"
                style={{
                  borderRadius: '0 0 4px 4px',
                  position: 'absolute',
                  zIndex: 20,
                  left: '0',
                  top: '100%',
                  minWidth: '150px',
                  overflow: 'hidden',
                  boxShadow:
                    '0 0 2px 0 rgba(0, 0, 0, 0.22), 0 20px 50px 0 rgba(0, 0, 0, 0.4)',
                }}
              >
                {this.props.children({
                  getItemProps,
                  selectedItem,
                  highlightedIndex,
                })}
              </Card>
            )}
          </Item>
        )}
      </Downshift>
    );
  }
}

export { Toolbar as default, ToolbarItem, ToolbarDropdownItem };
