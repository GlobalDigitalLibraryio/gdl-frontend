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
import { withTheme } from '@material-ui/core/styles';

import type { Category } from '../../types';
import media from '../../style/media';
import { fonts } from '../../style/theme';
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
  ${p =>
    p.isSelected &&
    css`
      font-weight: ${fonts.weight.medium};
      border-bottom: 3px solid ${p.hightLightColor};
    `};
`;

// Because of space limitations, we only show "mobile" on big screens
const HiddenMobile = styled('span')`
  ${media.mobile`
    display: none;
  `};
`;

type Props = {|
  categories: Array<Category>,
  category: Category,
  languageCode: string,
  theme: {
    palette: { primary: { main: string } }
  }
|};

class CategoryNavigation extends React.Component<Props> {
  render() {
    const { languageCode, category, categories, theme } = this.props;
    return (
      <Div>
        {categories.includes('library_books') && (
          <Link route="library" passHref params={{ lang: languageCode }}>
            <A
              isSelected={category === 'library_books'}
              hightLightColor={theme.palette.primary.main}
            >
              <Trans>
                Library <HiddenMobile>books</HiddenMobile>
              </Trans>
            </A>
          </Link>
        )}
        {categories.includes('classroom_books') && (
          <Link route="classroom" passHref params={{ lang: languageCode }}>
            <A
              isSelected={category === 'classroom_books'}
              hightLightColor={theme.palette.primary.main}
            >
              <Trans>
                Classroom <HiddenMobile>books</HiddenMobile>
              </Trans>
            </A>
          </Link>
        )}
      </Div>
    );
  }
}

export default withTheme()(CategoryNavigation);
