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
import styled, { css } from 'react-emotion';
import theming from 'styled-theming';

import type { I18n } from '../../types';
import LanguageCategoryContext from '../LanguageCategoryContext';
import { Link } from '../../routes';
import theme from '../../style/theme';

const color = theming('category', {
  library: css`
    color: ${theme.colors.link};
    &:hover {
      color: ${theme.colors.blues.dark};
    }
  `,
  classroom: css`
    color: ${theme.colors.pinks.dark};
    &:hover {
      color: ${theme.colors.pinks.pink};
    }
  `
});

const Div = styled.div`
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

  a {
    ${color};
  }
`;

type Props = {|
  i18n: I18n,
  crumbs: Array<React.Node | string>
|};

const Separator = (
  <li aria-hidden role="presentation">
    <MdKeyboardArrowRight />
  </li>
);

const Breadcrumb = ({ i18n, crumbs }: Props) => (
  <Div aria-label={i18n.t`Breadcrumb`}>
    <Ol>
      <li>
        <LanguageCategoryContext.Consumer>
          {({ category, language }) => {
            let route;
            if (category === 'classroom_books') {
              route = 'classroom';
            } else if (category === 'library_books') {
              route = 'library';
            } else {
              route = 'books';
            }

            return (
              <Link route={route} params={{ lang: language.code }}>
                <a title={i18n.t`Home`} aria-label={i18n.t`Home`}>
                  <MdHome />
                </a>
              </Link>
            );
          }}
        </LanguageCategoryContext.Consumer>
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
  </Div>
);

export default withI18n()(Breadcrumb);
