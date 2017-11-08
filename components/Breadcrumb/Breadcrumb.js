// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { MdKeyboardArrowRight, MdHome } from 'react-icons/lib/md';
import type { I18n } from 'lingui-i18n';
import { withI18n } from 'lingui-react';
import styled from 'styled-components';
import { Link } from '../../routes';

const Nav = styled.nav`
  display: flex;
  align-items: stretch;
  flex: 1;
`;

const Ol = styled.ol`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;

  li {
    display: flex;
    align-items: center;
  }
  li:last-child {
    font-weight: 500;
  }
`;

type Props = {
  i18n: I18n,
  currentPage: ?string,
  lang: string,
  router: {
    asPath: string,
    query: {
      [string]: ?string,
    },
  },
};

const Separator = (
  <li aria-hidden role="presentation" key="sep">
    <MdKeyboardArrowRight />
  </li>
);

class Breadcrumb extends React.Component<Props> {
  renderHome() {
    // Render as link
    if (this.props.currentPage) {
      return (
        <li>
          <Link route="books" params={{ lang: this.props.lang }}>
            <a title="Home" aria-label="Home">
              <MdHome />
            </a>
          </Link>
        </li>
      );
    }
    // Render as not a link :p
    return (
      <li aria-current="page">
        <MdHome aria-label="Home" />
      </li>
    );
  }

  renderMiddlePart() {
    const { query, asPath } = this.props.router;
    const { lang } = this.props;

    if (query.level && query.id) {
      return (
        <li>
          <Link route={`/${lang}/books/level${query.level}`}>
            <a>Level {query.level}</a>
          </Link>
        </li>
      );
    } else if (query.id && asPath.includes('/new/')) {
      return (
        <li>
          <Link route={`/${lang}/books/new`}>
            <a>New arrivals</a>
          </Link>
        </li>
      );
    }

    return null;
  }

  render() {
    const { i18n, currentPage } = this.props;

    const middle = this.renderMiddlePart();

    return (
      <Nav aria-label={i18n.t`Breadcrumb`} role="navigation">
        <Ol>
          {this.renderHome()}
          {middle && Separator}
          {middle}
          {currentPage && [
            Separator,
            <li aria-current="page">{currentPage}</li>,
          ]}
        </Ol>
      </Nav>
    );
  }
}

export default withI18n()(Breadcrumb);
