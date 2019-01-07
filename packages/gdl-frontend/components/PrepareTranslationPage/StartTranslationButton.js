// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { Trans, I18n } from '@lingui/react';
import { css } from 'react-emotion';

import {
  Card,
  Button,
  ClickAwayListener,
  Grow,
  Popper,
  MenuList,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import Router from 'next/router';
import green from '@material-ui/core/colors/green';

import type { BookDetails, Translation } from '../../types';
import { Link } from '../../routes';

class StartTranslationButton extends Component<
  { book: BookDetails, translation: ?Translation },
  { menuIsOpen: boolean }
> {
  anchorEl: ?HTMLAnchorElement = null;
  state = { menuIsOpen: false };

  handleToggle = () => {
    this.setState(state => ({ menuIsOpen: !state.menuIsOpen }));
  };

  handleClose = (event: any) => {
    if (this.anchorEl && this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ menuIsOpen: false });
  };

  // When Crowdin opens in a new tab, we want to redirect the user to "my translations"
  toCrowdin = () => Router.pushRoute('translations');

  render() {
    const { translation } = this.props;
    const { menuIsOpen } = this.state;

    return (
      <>
        <Button
          aria-owns={menuIsOpen ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
          variant="contained"
          color="primary"
          size="large"
          className={styles.buttonSucccess}
        >
          <Trans>Start translation</Trans>
        </Button>
        <I18n>
          {({ i18n }) => (
            <Popper
              open={menuIsOpen}
              anchorEl={this.anchorEl}
              transition
              disablePortal
              css={styles.translationMenu}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}
                >
                  <Card>
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        <LinkItem
                          route={`/en/books/translate/${
                            this.props.book.id
                          }/edit`}
                          params={{
                            id: this.props.book.id,
                            lang: this.props.book.language.code
                          }}
                        >
                          <Trans>Use in-context</Trans>
                        </LinkItem>
                        <Tooltip
                          title={i18n.t`Opens 3rd party site in a new window`}
                          placement="bottom"
                        >
                          <MenuItem
                            button
                            component="button"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={this.toCrowdin}
                            href={translation && translation.crowdinUrl}
                          >
                            <Trans>To Crowdin</Trans>
                          </MenuItem>
                        </Tooltip>
                      </MenuList>
                    </ClickAwayListener>
                  </Card>
                </Grow>
              )}
            </Popper>
          )}
        </I18n>
      </>
    );
  }
}

/**
 * <CardActions /> passes className to its children and by wrapping <Button/>
 * with <Link/>, we pass the className to <Button/>. Hence this wrapped component.
 */

const LinkItem = ({ route, onClick, params, ...rest }) => (
  <Link passHref route={route} params={params}>
    <MenuItem {...rest} component="a" />
  </Link>
);

const styles = {
  buttonSucccess: css`
    background-color: ${green[800]};
    &:hover {
      background-color: ${green[900]};
    }
  `,
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

export default StartTranslationButton;
