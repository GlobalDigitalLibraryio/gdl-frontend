// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Home as HomeIcon
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { withI18n } from '@lingui/react';
import styled from 'react-emotion';
import { withTheme } from '@material-ui/core/styles';

import type { I18n } from '../../types';
import { Link } from '../../routes';
import { colors } from '../../style/theme';

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

  li[role='presentation'] {
    color: ${colors.base.gray};
  }

  a {
    color: ${p => p.palette.primary.main};
    &:hover {
      color: ${p => p.palette.primary.dark};
    }
  }
`;

type Props = {|
  i18n: I18n,
  crumbs: Array<React.Node | string>,
  theme: { palette: {} }
|};

const Separator = (
  <li aria-hidden role="presentation">
    <KeyboardArrowRightIcon />
  </li>
);

const Breadcrumb = ({ i18n, crumbs, theme }: Props) => (
  <Nav aria-label={i18n.t`Breadcrumb`}>
    <Ol palette={theme.palette}>
      <li>
        <Link route="books">
          <a title={i18n.t`Home`} aria-label={i18n.t`Home`}>
            <HomeIcon />
          </a>
        </Link>
      </li>
      {crumbs &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {Separator}
            <Typography
              variant="body2"
              component="li"
              aria-current={index + 1 === crumbs.length ? 'page' : null}
            >
              {crumb}
            </Typography>
          </React.Fragment>
        ))}
    </Ol>
  </Nav>
);

export default withTheme()(withI18n()(Breadcrumb));
