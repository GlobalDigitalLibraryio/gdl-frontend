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

import type { Category, Language } from '../../types';
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
  category: Category,
  language: Language
};

class CategoryNavigation extends React.Component<Props> {
  render() {
    const { category, language } = this.props;
    return (
      <Div>
        <Link route="library" passHref params={{ lang: language.code }}>
          <A
            className={cx({
              [selectedClass]: category === 'library_books'
            })}
          >
            <Trans>
              Library <HiddenMobile>books</HiddenMobile>
            </Trans>
          </A>
        </Link>
        <Link route="classroom" passHref params={{ lang: language.code }}>
          <A
            className={cx({
              [selectedClass]: category === 'classroom_books'
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
