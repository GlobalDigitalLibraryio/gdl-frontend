// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import createReactContext, { type Context } from 'create-react-context';
import type { Category, Language } from '../types';

export const LanguageCategoryContext: Context<{|
  category: ?Category,
  language: Language
|}> = createReactContext({
  category: undefined,
  language: { name: 'English', code: 'en' }
});

export default LanguageCategoryContext;

type Props = {|
  language: Language,
  category: ?Category,
  children: Node
|};

export const LanguageCategory = ({ children, category, language }: Props) => (
  <LanguageCategoryContext.Provider value={{ category, language }}>
    {children}
  </LanguageCategoryContext.Provider>
);
