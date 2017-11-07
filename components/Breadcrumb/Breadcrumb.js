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
  currentPage: string,
};

const Separator = (
  <li aria-hidden role="presentation">
    <MdKeyboardArrowRight />
  </li>
);

class Breadcrumb extends React.Component<Props> {
  renderHome() {
    if (this.props.currentPage) {
      return [
        <li>
          <Link route="books" passHref>
            <a aria-label="Home" title="Home">
              <MdHome />
            </a>
          </Link>
        </li>,
        Separator,
      ];
    }
    return null;
  }

  render() {
    const { currentPage } = this.props;
    return (
      <nav aria-label={this.props.i18n.t`Breadcrumb`} role="navigation">
        <Ol>
          {this.renderHome()}
          <li aria-current="page" aria-label={currentPage ? 'Home' : null}>
            {currentPage || <MdHome />}
          </li>
        </Ol>
      </nav>
    );
  }
}

export default withI18n()(Breadcrumb);
