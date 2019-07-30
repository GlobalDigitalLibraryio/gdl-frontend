// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { Link } from '../routes';
import type { Category } from '../gqlTypes';

export type Props = {
  route: 'browseBooks' | 'browseGames',
  category?: Category,
  lang: string,
  readingLevel?: string,
  sort?: '-arrivalDate',
  children?: Node
};

// Special link component that routes the browse page. Nice to typecheck the props
export default ({ children, route, ...props }: Props) => (
  <Link passHref params={props} route={route}>
    {children}
  </Link>
);
