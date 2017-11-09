// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
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

export default class Sidebar extends React.Component<Props, State> {
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

  // $FlowFixMe Flow complains if componentDidMount is async... Even though it shouldn't?
  async componentDidMount() {
    // Bail out of refetching if we already have set stuff from the cache in the contructor
    if (this.state.levels.length > 0) {
      return;
    }

    const [languages, levels] = await Promise.all([
      fetchLanguages(),
      fetchLevels(),
    ]);

    // Eslint should allow this? We are async after all
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      levels,
      languages,
    });
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

  wrap: ?HTMLDivElement;

  render() {
    const { language } = this.props;

    return (
      <Backdrop onClick={this.onOutsideClick}>
        <KeyDown when="Escape" then={this.props.onCloseRequested} />
        <Container
          mw={1075}
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
            <Downshift id="bookLanguageMenu">
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
                        <MenuItem
                          key={lang.code}
                          {...getItemProps({ item: lang.code })}
                        >
                          <Link route="books" params={{ lang: lang.code }}>
                            <a>{lang.name}</a>
                          </Link>
                        </MenuItem>
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
              <MenuItem key={level}>
                <Link route="level" params={{ lang: language.code, level }}>
                  <a>
                    <Trans>Level {level}</Trans>
                  </a>
                </Link>
              </MenuItem>
            ))}
            <MenuItem style={{ marginTop: '3px' }}>
              <Link route="new" params={{ lang: language.code }}>
                <a>
                  <Trans>New arrivals</Trans>
                </a>
              </Link>
            </MenuItem>
          </Bar>
        </Container>
      </Backdrop>
    );
  }
}
