// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { MdCheck, MdKeyboardArrowRight } from 'react-icons/lib/md';
import { Trans } from '@lingui/react';
import { cx } from 'react-emotion';

import SrOnly from '../SrOnly';
import { Item, ItemIcon, itemActionStyle } from './styled/Content';

type Props = {
  isSelected?: boolean,
  showKeyLine?: boolean,
  href?: string,
  onClick?: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void,
  onCustomClick?: (event: SyntheticMouseEvent<any>) => void,
  hasNestedMenu?: boolean,
  children: Node
};

const ItemLink = Item.withComponent('a');

class MenuItem extends React.Component<Props> {
  /**
   * Small trick to handle Next.js swallowing up any onClicks on Link components
   * See https://github.com/zeit/next.js/issues/1490#issuecomment-290724312
   */
  handleClick = (event: SyntheticMouseEvent<any>) => {
    this.props.onClick && this.props.onClick(event);

    this.props.onCustomClick && this.props.onCustomClick(event);
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<any>) => {
    if (event.key === 'Enter') {
      this.props.onClick && this.props.onClick(event);
      this.props.onCustomClick && this.props.onCustomClick(event);
    }
  };

  render() {
    const {
      isSelected,
      hasNestedMenu,
      showKeyLine,
      children,
      onClick,
      href
    } = this.props;
    const ItemComponent = href ? ItemLink : Item;

    return (
      <ItemComponent
        className={cx({ [itemActionStyle]: href || onClick })}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        href={href}
        showKeyLine={showKeyLine}
        tabIndex={href ? null : onClick ? '0' : null}
      >
        {isSelected && (
          <ItemIcon isSelected={isSelected}>
            <MdCheck aria-hidden />
            <SrOnly>
              <Trans>Selected:</Trans>
            </SrOnly>
          </ItemIcon>
        )}
        {children}
        {hasNestedMenu && (
          <ItemIcon aria-hidden style={{ right: '10px', left: 'unset' }}>
            <MdKeyboardArrowRight />
          </ItemIcon>
        )}
      </ItemComponent>
    );
  }
}

export default MenuItem;
