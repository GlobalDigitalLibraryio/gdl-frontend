// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Manager, Target, Popper } from 'react-popper';
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
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
`;

type Props = {
  id: string, // Because we want to avoid using Downshift's automatically generated id to prevent checksums errors with SSR
  renderTarget(getButtonProps: Function, isOpen: boolean): React.Node,
  children: ({
    highlightedIndex: number,
    getItemProps: ({ item: string }) => void,
  }) => React.ChildrenArray<React.Element<typeof CardDropdownItem>>,
};

class CardDropdown extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <Manager tag={false}>
        <Downshift id={this.props.id}>
          {({
            getButtonProps,
            isOpen,
            getItemProps,
            highlightedIndex,
            selectedItem,
          }) => (
            <div>
              <Target>{this.props.renderTarget(getButtonProps, isOpen)}</Target>
              {isOpen && (
                <Popper
                  placement="bottom"
                  style={{ width: '100%', zIndex: 999 }}
                >
                  <Dropdown px={0} py={0}>
                    {this.props.children({
                      getItemProps,
                      selectedItem,
                      highlightedIndex,
                    })}
                  </Dropdown>
                </Popper>
              )}
            </div>
          )}
        </Downshift>
      </Manager>
    );
  }
}

export { CardDropdown as default, CardDropdownItem };
