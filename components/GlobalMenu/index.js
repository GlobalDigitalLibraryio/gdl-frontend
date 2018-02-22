// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { withRouter } from 'next/router';
import { Trans } from '@lingui/react';
import { MdHome } from 'react-icons/lib/md';
import Link from 'next/link';

import config from '../../config';
import type { Language } from '../../types';
import { fetchLanguages, fetchLevels } from '../../fetch';
import { Link as RouteLink } from '../../routes';
import { getAuthToken } from '../../lib/auth/token';
import Menu, { MenuItem } from '../Menuu';
import CreativeCommonsLogo from './cc-logo.svg';
import LanguageMenu from '../LanguageMenu';

type Props = {
  onClose(): void,
  id: string,
  language: Language,
  router: {
    asPath: string
  }
};

type State = {
  languages: Array<Language>,
  levels: Array<string>,
  showLanguageMenu: boolean
};

type Cache = State & {
  language: ?Language
};

const stateCache: Cache = {
  languages: [],
  levels: [],
  language: null
};

class GlobalMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (
      stateCache.language &&
      stateCache.language.code === props.language.code
    ) {
      this.state = {
        languages: stateCache.languages,
        levels: stateCache.levels,
        showLanguageMenu: false
      };
    } else {
      this.state = {
        languages: [],
        levels: [],
        showLanguageMenu: false
      };
    }
  }

  componentDidMount() {
    // Only fetch if we haven't already set stuff from the cache in the constructor
    if (this.state.levels.length === 0) {
      this.getMenuData();
    }
    // Remember the last language we mounted with in the cache
    stateCache.language = this.props.language;
  }

  /* componentWillReceiveProps(nextProps) {
    if (this.props.router !== nextProps.router) {
      nextProps.onCloseRequested();
    }
  } */

  /**
   * When unmounting, we keep the langauge and level results so we won't have to refetch it on a different page if the langauge is the same
   */
  componentWillUnmount() {
    stateCache.languages = this.state.languages;
    stateCache.levels = this.state.levels;
  }

  getMenuData = async () => {
    const [languages, levels] = await Promise.all([
      fetchLanguages()(),
      fetchLevels(this.props.language.code)()
    ]);

    this.setState({
      levels,
      languages
    });
  };

  toggleShowLanguageMenu = event => {
    event.preventDefault();
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));
  };

  render() {
    const { language, onClose } = this.props;

    return (
      <Fragment>
        {this.state.showLanguageMenu && (
          <LanguageMenu
            isNestedMenu
            selectedLanguage={language}
            languages={this.state.languages}
            onClose={this.toggleShowLanguageMenu}
          />
        )}
        <Menu heading={<Trans>Menu</Trans>} onClose={onClose}>
          <MenuItem
            showKeyLine
            hasNestedMenu
            onClick={this.toggleShowLanguageMenu}
          >
            <Trans>Book language</Trans>
          </MenuItem>

          <MenuItem href="https://home.digitallibrary.io/about/">
            <Trans>About Global Digital Library</Trans>
          </MenuItem>

          {config.TRANSLATION_PAGES && (
            <React.Fragment>
              <RouteLink passHref route="translations">
                <MenuItem>
                  <Trans>My translations</Trans>
                </MenuItem>
              </RouteLink>
              {getAuthToken() != null && (
                <Link passHref href="/auth/sign-off">
                  <MenuItem>
                    <Trans>Log out</Trans>
                  </MenuItem>
                </Link>
              )}
            </React.Fragment>
          )}

          <MenuItem>
            <CreativeCommonsLogo />
          </MenuItem>
        </Menu>
      </Fragment>
    );

    /* return (
      <Backdrop onClick={this.handleOutsideClick}>
        <Container size="large">
          <ModalCard
            id={this.props.id}
            innerRef={c => {
              this.modal = c;
            }}
          >
            <Flex
              h={[48, 80]}
              px={15}
              justifyContent="space-between"
              alignItems="center"
              style={{ borderBottom: `1px solid ${theme.colors.grayLight}` }}
            >
              <RouteLink route="books" params={{ lang: language.code }}>
                <a>
                  <SrOnly>
                    <Trans>Home</Trans>
                  </SrOnly>
                  <MdHome />
                </a>
              </RouteLink>
              <Trans>Menu</Trans>{' '}
              <IconButton
                onClick={this.props.onCloseRequested}
                aria-label="Close menu"
                type="button"
              >
                <MdClose />
              </IconButton>
            </Flex>

            <Downshift
              id="bookLanguageMenu"
              selectedItem={this.props.language.code}
            >
              {({ getButtonProps, isOpen, closeMenu, getItemProps }) => (
                <div>
                  <MenuItem {...getButtonProps()} tabIndex="0" thickBorder>
                    <span>
                      <Trans>
                        Books in <strong>{language.name}</strong>
                      </Trans>
                    </span>
                    <MdKeyboardArrowRight style={{ marginLeft: 'auto' }} />
                  </MenuItem>
                  {isOpen && (
                    <ModalCard
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0
                      }}
                    >
                      <Flex
                        h={48}
                        alignItems="center"
                        style={{
                          borderBottom: `1px solid ${theme.colors.grayLight}`
                        }}
                      >
                        <IconButton onClick={closeMenu}>
                          <MdKeyboardArrowLeft />
                        </IconButton>
                        <Trans>Language</Trans>
                      </Flex>
                      {this.state.languages.map(lang => (
                        <RouteLink
                          passHref
                          key={lang.code}
                          route="books"
                          params={{ lang: lang.code }}
                        >
                          <MenuItem
                            {...getItemProps({ item: lang.code })}
                            thinBorder
                          >
                            {lang.name}
                          </MenuItem>
                        </RouteLink>
                      ))}
                    </ModalCard>
                  )}
                </div>
              )}
            </Downshift>

            {this.state.levels.map(level => (
              <RouteLink
                passHref
                key={level}
                route="level"
                params={{ lang: language.code, level }}
              >
                <MenuItem key={level} thinBorder>
                  <Trans>Level {level}</Trans>
                </MenuItem>
              </RouteLink>
            ))}
            <RouteLink passHref route="new" params={{ lang: language.code }}>
              <MenuItem thickBorder>
                <Trans>New arrivals</Trans>
              </MenuItem>
            </RouteLink>
            <MenuItem href="https://home.digitallibrary.io/about/">
              <Trans>About Global Digital Library</Trans>
            </MenuItem>
            {config.TRANSLATION_PAGES && (
              <React.Fragment>
                <RouteLink passHref route="translations">
                  <MenuItem>
                    <Trans>My translations</Trans>
                  </MenuItem>
                </RouteLink>
                {getAuthToken() != null && (
                  <Link passHref href="/auth/sign-off">
                    <MenuItem>
                      <Trans>Log out</Trans>
                    </MenuItem>
                  </Link>
                )}
              </React.Fragment>
            )}
          </ModalCard>
        </Container>
      </Backdrop>
    ); */
  }
}

export default GlobalMenu;
