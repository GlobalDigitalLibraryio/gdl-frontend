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

import { type CategoryType } from '../../types';
import media from '../../style/media';
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

// Because of space limitations, we only show "mobile" on big screens
const HiddenMobile = styled('span')`
  ${media.mobile`
    display: none;
  `};
`;

type Props = {
  categoryType: CategoryType
};

class CategoryNavigation extends React.Component<Props> {
  render() {
    const { categoryType } = this.props;
    return (
      <Div>
        <Link route="library" passHref params={{ lang: 'eng' }}>
          <A
            className={cx({
              [selectedClass]: categoryType === 'library_books'
            })}
          >
            <Trans>
              Library <HiddenMobile>books</HiddenMobile>
            </Trans>
          </A>
        </Link>
        <Link route="classroom" passHref params={{ lang: 'eng' }}>
          <A
            className={cx({
              [selectedClass]: categoryType === 'classroom_books'
            })}
          >
            <Trans>
              Classroom <HiddenMobile>books</HiddenMobile>
            </Trans>
          </A>
        </Link>
      </Div>
    );
  }
}

export default CategoryNavigation;
