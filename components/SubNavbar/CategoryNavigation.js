// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';

const Div = styled('div')`
  display: flex;
  align-items: center;
`;

const A = styled('a')`
  color: inherit;
  &:not(:last-child) {
    margin-right: 1em;
  }
  &:hover {
    font-weight: 500;
  }
`;

const selectedClass = css`
  font-weight: 500;
  border-bottom: 3px solid #0085dd;
`;

class CategoryNavigation extends React.Component {
  render() {
    return (
      <Div>
        <Link route="books" passHref params={{ lang: 'eng' }}>
          <A className={selectedClass}>
            <Trans>Library</Trans>
          </A>
        </Link>
        <Link route="books" passHref params={{ lang: 'eng' }}>
          <A>
            <Trans>Classroom</Trans>
          </A>
        </Link>
      </Div>
    );
  }
}

export default CategoryNavigation;
