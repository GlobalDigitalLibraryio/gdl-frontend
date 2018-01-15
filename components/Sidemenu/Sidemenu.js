// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withRouter } from 'next/router';
import Downshift from 'downshift';
import { Trans } from 'lingui-react';
import {
  MdClose,
  MdHome,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft
} from 'react-icons/lib/md';
import config from '../../config';
import type { Language } from '../../types';
import { fetchLanguages, fetchLevels } from '../../fetch';
import Flex from '../Flex';
import { Link } from '../../routes';
import MenuItem from '../Menu/MenuItem';
import Backdrop from '../Menu/Backdrop';
import ModalCard from '../Menu/ModalCard';
import Container from '../Menu/Container';
import IconButton from '../Menu/IconButton';
import theme from '../../style/theme';
import SrOnly from '../SrOnly';

type Props = {
  onCloseRequested(): void,
  id: string,
  language: Language,
  router: {
    asPath: string
  }
};

type State = {
  languages: Array<Language>,
  levels: Array<string>
};

type Cache = State & {
  language: ?Language
};

const stateCache: Cache = {
  languages: [],
  levels: [],
  language: null
};

class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (
      stateCache.language &&
      stateCache.language.code === props.language.code
    ) {
      this.state = {
        languages: stateCache.languages,
        levels: stateCache.levels
      };
    } else {
      this.state = {
        languages: [],
        levels: []
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

  componentWillReceiveProps(nextProps) {
    if (this.props.router !== nextProps.router) {
      nextProps.onCloseRequested();
    }
  }

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

  handleOutsideClick = event => {
    if (
      this.modal &&
      event.target instanceof Node &&
      !this.modal.contains(event.target)
    ) {
      this.props.onCloseRequested();
    }
  };

  modal: ?HTMLDivElement;

  render() {
    const { language } = this.props;

    return (
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
              justify="space-between"
              align="center"
              style={{ borderBottom: `1px solid ${theme.colors.grayLight}` }}
            >
              <Link route="books" params={{ lang: language.code }}>
                <a>
                  <SrOnly>
                    <Trans>Home</Trans>
                  </SrOnly>
                  <MdHome />
                </a>
              </Link>
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
                        align="center"
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
                        <Link
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
                        </Link>
                      ))}
                    </ModalCard>
                  )}
                </div>
              )}
            </Downshift>

            {this.state.levels.map(level => (
              <Link
                passHref
                key={level}
                route="level"
                params={{ lang: language.code, level }}
              >
                <MenuItem key={level} thinBorder>
                  <Trans>Level {level}</Trans>
                </MenuItem>
              </Link>
            ))}
            <Link passHref route="new" params={{ lang: language.code }}>
              <MenuItem thickBorder>
                <Trans>New arrivals</Trans>
              </MenuItem>
            </Link>
            <Link passHref route="about">
              <MenuItem>
                <Trans>About Global Digital Library</Trans>
              </MenuItem>
            </Link>
            {config.TRANSLATION_PAGES && (
              <Link passHref route="translations">
                <MenuItem>
                  <Trans>My translations</Trans>
                </MenuItem>
              </Link>
            )}
          </ModalCard>
        </Container>
      </Backdrop>
    );
  }
}

export default withRouter(Sidebar);
