// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { Link } from '../routes';

type Props = {|
  category: 'classroom_books' | 'library_books',
  lang: string,
  readingLevel?: string,
  sort?: '-arrivalDate',
  children: Node
|};

// Special link component that routes the browse page. Nice to typecheck the props
export default ({ children, ...props }: Props) => (
  <Link route="browse" passHref params={props}>
    {children}
  </Link>
);
