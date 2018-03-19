// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Trans } from '@lingui/react';
import theming from 'styled-theming';

import theme from '../../style/theme';
import type { Category, Language } from '../../types';
import media from '../../style/media';
import { Link } from '../../routes';

const Div = styled('div')`
  display: flex;
  align-items: center;
`;

const borderColor = theming('category', {
  library: '#0085dd',
  classroom: theme.colors.pinks.pink
});

const A = styled('a')`
  color: inherit;
  &:not(:last-child) {
    margin-right: 1em;
  }
  &:hover {
    font-weight: 500;
  }
  ${p =>
    p.isSelected &&
    css`
      font-weight: 500;
      border-bottom: 3px solid ${borderColor(p)};
    `};
`;

// Because of space limitations, we only show "mobile" on big screens
const HiddenMobile = styled('span')`
  ${media.mobile`
    display: none;
  `};
`;

type Props = {|
  category: Category,
  language: Language
|};

class CategoryNavigation extends React.Component<Props> {
  render() {
    const { category, language } = this.props;
    return (
      <Div>
        <Link route="library" passHref params={{ lang: language.code }}>
          <A isSelected={category === 'library_books'}>
            <Trans>
              Library <HiddenMobile>books</HiddenMobile>
            </Trans>
          </A>
        </Link>
        <Link route="classroom" passHref params={{ lang: language.code }}>
          <A isSelected={category === 'classroom_books'}>
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
