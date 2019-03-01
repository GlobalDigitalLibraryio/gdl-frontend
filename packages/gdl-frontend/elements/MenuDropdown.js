// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import React, { PureComponent, type Element } from 'react';
import { css } from '@emotion/core';
import {
  Card,
  ClickAwayListener,
  Grow,
  Popper,
  MenuList,
  Button
} from '@material-ui/core';

type Props = {
  anchorRef: ?React$ElementRef<Button>,
  open: boolean,
  onClose: () => void,
  children: Element<MenuList>
};

class MenuDropdown extends PureComponent<Props> {
  render() {
    const { open, onClose, anchorRef } = this.props;

    return (
      <Popper
        open={open}
        anchorEl={anchorRef}
        transition
        disablePortal
        css={styles.translationMenu}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{
              transformOrigin: 'left bottom'
            }}
          >
            <Card>
              <ClickAwayListener onClickAway={onClose}>
                {this.props.children}
              </ClickAwayListener>
            </Card>
          </Grow>
        )}
      </Popper>
    );
  }
}

const styles = {
  translationMenu: css`
    position: absolute;
    left: 0;
    right: 0;
    margin-right: auto;
    margin-left: auto;
    z-index: 1000;
    width: fit-content;
  `
};

export default MenuDropdown;
