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

import { colors } from '../../style/theme';
import { logEvent } from '../../lib/analytics';
import type { Category } from '../../gqlTypes';
import SrOnly from '../../components/SrOnly';
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
      border-bottom: 3px solid ${colors.default};
    `};
`;

type Props = {|
  categories: Array<Category>,
  category: Category,
  languageCode: string
|};

class CategoryNavigation extends React.Component<Props> {
  render() {
    const { languageCode, category, categories } = this.props;
    return (
      <Div>
        {categories.includes('Library') && (
          <Tab
            isSelected={category === 'Library'}
            linkProps={{ route: 'library', params: { lang: languageCode } }}
            onClick={() => logEvent('Navigation', 'Category', 'Classroom')}
          >
            <Trans>Library books</Trans>
          </Tab>
        )}
        {categories.includes('Classroom') && (
          <Tab
            isSelected={category === 'Classroom'}
            linkProps={{ route: 'classroom', params: { lang: languageCode } }}
            onClick={() => logEvent('Navigation', 'Category', 'Library')}
          >
            <Trans>Classroom books</Trans>
          </Tab>
        )}
      </Div>
    );
  }
}

const Tab = ({ isSelected, theme, children, linkProps, ...props }) => (
  <Link passHref {...linkProps}>
    <A isSelected={isSelected} {...props}>
      {isSelected && (
        <SrOnly>
          <Trans>Selected: </Trans>
        </SrOnly>
      )}
      {children}
    </A>
  </Link>
);

export default CategoryNavigation;
