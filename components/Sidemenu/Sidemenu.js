// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { withRouter } from 'next/router';
import Downshift from 'downshift';
import { Trans } from 'lingui-react';
import {
  MdClose,
  MdHome,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft
} from 'react-icons/lib/md';
import type { Language } from '../../types';
import { fetchLanguages, fetchLevels } from '../../fetch';
import Container from '../Container';
import Flex from '../Flex';
import { Link } from '../../routes';
import MenuItem from '../Menu/MenuItem';
import Backdrop from '../Menu/Backdrop';
import Card from '../Menu/ModalCard';
import theme from '../../style/theme';
import SrOnly from '../SrOnly';

const Button = styled.button`
  background: transparent;
  border: none;
  color: inherit;
`;

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

  render() {
    const { language } = this.props;

    return (
      <Backdrop>
        <Container
          size="large"
          style={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}
        >
          <Card id={this.props.id}>
            <Flex h={[48, 80]} px={15} justify="space-between" align="center">
              <Link route="books" params={{ lang: language.code }}>
                <Button type="button">
                  <SrOnly>
                    <Trans>Home</Trans>
                  </SrOnly>
                  <MdHome />
                </Button>
              </Link>
              <Trans>Menu</Trans>{' '}
              <Button
                onClick={this.props.onCloseRequested}
                aria-label="Close menu"
                type="button"
              >
                <MdClose />
              </Button>
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
                    <Card
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0
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
                          <MenuItem
                            {...getItemProps({ item: lang.code })}
                            thinBorder
                          >
                            {lang.name}
                          </MenuItem>
                        </Link>
                      ))}
                    </Card>
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
              <MenuItem style={{ marginTop: '3px' }} thickBorder>
                <Trans>New arrivals</Trans>
              </MenuItem>
            </Link>
            <Link passHref route="about">
              <MenuItem>
                <Trans>About Global Digital Library</Trans>
              </MenuItem>
            </Link>
          </Card>
        </Container>
      </Backdrop>
    );
  }
}

export default withRouter(Sidebar);
