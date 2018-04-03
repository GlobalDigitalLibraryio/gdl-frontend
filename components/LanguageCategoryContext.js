// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import createReactContext, { type Context } from 'create-react-context';
import { DEFAULT_LANGUAGE_CODE } from '../config';
import type { Category } from '../types';

export const LanguageCategoryContext: Context<{|
  category: ?Category,
  languageCode: string
|}> = createReactContext({
  category: undefined,
  languageCode: DEFAULT_LANGUAGE_CODE
});

export default LanguageCategoryContext;

type Props = {|
  languageCode: string,
  category: ?Category,
  children: Node
|};

export const LanguageCategory = ({
  children,
  category,
  languageCode
}: Props) => (
  <LanguageCategoryContext.Provider value={{ category, languageCode }}>
    {children}
  </LanguageCategoryContext.Provider>
);
