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

import { Button, MenuList, MenuItem, Tooltip } from '@material-ui/core';
import Router from 'next/router';
import green from '@material-ui/core/colors/green';

import type { BookDetails, Translation } from '../../types';
import { Link } from '../../routes';
import MenuDropdown from '../../elements/MenuDropdown';

class StartTranslationButton extends Component<
  { book: BookDetails, translation: ?Translation },
  { menuIsOpen: boolean }
> {
  anchorEl: ?React$ElementRef<Button> = React.createRef();
  state = { menuIsOpen: false };

  handleToggle = () => {
    this.setState(state => ({ menuIsOpen: !state.menuIsOpen }));
  };

  handleClose = () => this.setState({ menuIsOpen: false });

  // When Crowdin opens in a new tab, we want to redirect the user to "my translations"
  toTranslation = () => Router.pushRoute('translations');

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
        <MenuDropdown open={menuIsOpen} onClose={this.handleClose}>
          <MenuList>
            <LinkItem
              route={`/en/books/translate/${this.props.book.id}/edit`}
              params={{
                id: this.props.book.id,
                lang: this.props.book.language.code
              }}
            >
              <Trans>Use in-context</Trans>
            </LinkItem>
            <I18n>
              {({ i18n }) => (
                <Tooltip
                  title={i18n.t`Opens 3rd party site in a new window`}
                  placement="bottom"
                >
                  <MenuItem
                    button
                    component="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.toTranslation}
                    href={translation && translation.crowdinUrl}
                  >
                    <Trans>To Crowdin</Trans>
                  </MenuItem>
                </Tooltip>
              )}
            </I18n>
          </MenuList>
        </MenuDropdown>
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
  translationMenu: css``
};

export default StartTranslationButton;
