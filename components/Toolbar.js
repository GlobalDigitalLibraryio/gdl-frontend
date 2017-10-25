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

/* eslint-disable react/no-multi-comp */

const Toolbar = styled.div`
  background: ${props => props.theme.grays.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-size: 14px;
  position: relative;
`;

const Item = styled.div`
  border-right: solid 1px ${props => props.theme.grays.platinum};
  &:first-child {
    border-left: solid 1px ${props => props.theme.grays.platinum};
  }
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.a.attrs({
  href: '',
})`
  padding: 10px 15px;
  display: block;
`;

const DropdownItemAnchor = styled.a`
  display: block;
  padding: 10px 15px;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.grays.platinum};
  }

  & svg {
    color: ${props =>
      props.isSelected
        ? props.theme.supports.greenDark
        : props.theme.grays.gainsboro};
    margin-right: 10px;
  }

  ${props =>
    props.isActive && `background-color: ${props.theme.primaries.highlight}`};
  ${props =>
    props.isSelected &&
    `background-color: ${props.theme.supports.greenHighlight}`};
`;

/**
 * Next.js links 'steals' onClick's. Working around this with this small trick so the dropdown closes when selecting in the dropdown
 * See https://github.com/zeit/next.js/issues/1490#issuecomment-290724312
 */
class ToolbarDropdownItem extends React.Component<{
  onClick: Function,
  onCustomClick: Function,
}> {
  handleClick = (event: Event) => {
    this.props.onClick(event);
    this.props.onCustomClick(event);
  };
  render() {
    return <DropdownItemAnchor {...this.props} onClick={this.handleClick} />;
  }
}

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

// eslint-disable-next-line react/prefer-stateless-function
class ToolbarItem extends React.Component<Props> {
  render() {
    return (
      <Downshift selectedItem={this.props.selectedItem} id={this.props.id}>
        {({
          getButtonProps,
          getRootProps,
          getItemProps,
          highlightedIndex,
          selectedItem,
          isOpen,
          closeMenu,
        }) => (
          <Item {...getRootProps({ refKey: 'innerRef' })}>
            <DropdownButton {...getButtonProps()}>
              {this.props.text}{' '}
              {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </DropdownButton>
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
                  getItemProps: args => ({
                    ...getItemProps(args),
                    onCustomClick: closeMenu,
                  }),
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
