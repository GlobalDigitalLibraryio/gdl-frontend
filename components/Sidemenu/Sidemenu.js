// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import Downshift from 'downshift';
import { Trans } from 'lingui-react';
import {
  MdClose,
  MdHome,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from 'react-icons/lib/md';
import type { Language } from '../../types';
import { fetchLanguages, fetchLevels } from '../../fetch';
import Container from '../Container';
import Flex from '../Flex';
import Backdrop from './Backdrop';
import Bar from './Bar';
import { Link } from '../../routes';
import KeyDown from '../KeyDown';
import MenuLabel from './MenuLabel';
import MenuItem from './MenuItem';

const Button = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  border: none;
  color: inherit;
`;

type Props = {
  onCloseRequested(): void,
  id: string,
  language: Language,
  router: {
    asPath: string,
  },
};

type State = {
  languages: Array<Language>,
  levels: Array<string>,
};

type Cache = State & {
  language: ?Language,
};

const stateCache: Cache = {
  languages: [],
  levels: [],
  language: null,
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
        levels: stateCache.levels,
      };
    } else {
      this.state = {
        languages: [],
        levels: [],
      };
    }
  }

  componentDidMount() {
    // Only fetch if we haven't already set stuff from the cache in the constructor
    if (this.state.levels.length === 0) {
      this.getMenuData();
    }
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
    stateCache.language = this.props.language;
  }
  /**
   * If click event didn't originate from inside the sidenav, we close it
   */
  onOutsideClick = (event: SyntheticEvent<>) => {
    if (
      this.wrap &&
      event.target instanceof Node &&
      !this.wrap.contains(event.target)
    ) {
      this.props.onCloseRequested();
    }
  };

  getMenuData = async () => {
    const [languages, levels] = await Promise.all([
      fetchLanguages()(),
      fetchLevels(this.props.language.code)(),
    ]);

    this.setState({
      levels,
      languages,
    });
  };

  wrap: ?HTMLDivElement;

  render() {
    const { language } = this.props;

    return (
      <Backdrop onClick={this.onOutsideClick}>
        <KeyDown when="Escape" then={this.props.onCloseRequested} />
        <Container
          size="large"
          style={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}
        >
          <Bar
            id={this.props.id}
            innerRef={c => {
              this.wrap = c;
            }}
          >
            <Flex h={[48, 80]} px={15} justify="space-between" align="center">
              <Link route="books" params={{ lang: 'eng' }}>
                <Button>
                  <MdHome />
                </Button>
              </Link>
              <Trans>Menu</Trans>{' '}
              <Button
                onClick={this.props.onCloseRequested}
                aria-label="Close menu"
              >
                <MdClose />
              </Button>
            </Flex>

            <MenuLabel>
              <Trans>Language</Trans>
            </MenuLabel>
            <Downshift
              id="bookLanguageMenu"
              selectedItem={this.props.language.code}
            >
              {({ getButtonProps, isOpen, closeMenu, getItemProps }) => (
                <div>
                  <MenuItem {...getButtonProps()} tabIndex="0">
                    <span>
                      <Trans>
                        Books in <strong>{language.name}</strong>
                      </Trans>
                    </span>
                    <MdKeyboardArrowRight style={{ marginLeft: 'auto' }} />
                  </MenuItem>
                  {isOpen && (
                    <Bar
                      style={{
                        marginLeft: '28px',
                        position: 'absolute',
                        top: 0,
                      }}
                    >
                      <Flex h={48} align="center">
                        <Button onClick={closeMenu}>
                          <MdKeyboardArrowLeft />
                        </Button>
                        <Trans>Language</Trans>
                      </Flex>
                      {this.state.languages.map(lang => (
                        <Link
                          passHref
                          key={lang.code}
                          route="books"
                          params={{ lang: lang.code }}
                        >
                          <MenuItem {...getItemProps({ item: lang.code })}>
                            {lang.name}
                          </MenuItem>
                        </Link>
                      ))}
                    </Bar>
                  )}
                </div>
              )}
            </Downshift>

            <MenuLabel>
              <Trans>Content</Trans>
            </MenuLabel>
            {this.state.levels.map(level => (
              <Link
                passHref
                key={level}
                route="level"
                params={{ lang: language.code, level }}
              >
                <MenuItem key={level}>
                  <Trans>Level {level}</Trans>
                </MenuItem>
              </Link>
            ))}
            <Link passHref route="new" params={{ lang: language.code }}>
              <MenuItem style={{ marginTop: '3px' }}>
                <Trans>New arrivals</Trans>
              </MenuItem>
            </Link>
          </Bar>
        </Container>
      </Backdrop>
    );
  }
}

export default withRouter(Sidebar);
