// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { MdKeyboardArrowRight, MdHome } from 'react-icons/lib/md';
import { withI18n } from '@lingui/react';
import styled from 'react-emotion';
import type { I18n } from '../types';
import { Link } from '../routes';
import theme from '../style/theme';

const Nav = styled.nav`
  display: flex;
  align-items: stretch;
  flex: 1;
  overflow: hidden;
  overflow-x: auto;
  white-space: nowrap;
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
    font-weight: bold;
  }
  li[role='presentation'] {
    color: ${theme.colors.gray};
  }
  a:hover {
    color: ${theme.colors.blues.dark};
  }
`;

type Props = {
  i18n: I18n,
  crumbs: Array<React.Node | string>,
  language: string,
};

const Separator = (
  <li aria-hidden role="presentation">
    <MdKeyboardArrowRight />
  </li>
);

const Breadcrumb = ({ i18n, crumbs, language }: Props) => (
  <Nav aria-label={i18n.t`Breadcrumb`} role="navigation">
    <Ol>
      <li>
        <Link route="books" params={{ lang: language }}>
          <a title={i18n.t`Home`} aria-label={i18n.t`Home`}>
            <MdHome />
          </a>
        </Link>
      </li>
      {crumbs &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {Separator}
            <li aria-current={index + 1 === crumbs.length ? 'page' : null}>
              {crumb}
            </li>
          </React.Fragment>
        ))}
    </Ol>
  </Nav>
);

export default withI18n()(Breadcrumb);
