// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import NextHead from 'next/head';
import { withI18n } from 'lingui-react';
import type { I18n } from 'lingui-i18n';


const META = {
  TWITTER: '@GDigitalLibrary',
  KEYWORDS: 'Books, Reading, Children, Library, Learning',
  TITLE: 'Global Digital Library',
  TITLE_ABBR: 'GDL',
};


type Props = {
  description?: string,
  title?: string,
  imageUrl?: ?string,
  children?: React.Node,
  i18n: I18n,
  isBookType: boolean,
};

/**
 * The og:url meta property is generated in _document on SSR
 */

const Head = ({ title, description, i18n, imageUrl, isBookType, children }: Props) => {
  const actualTitle = title ? `${META.TITLE_ABBR} - ${title}` : META.TITLE;
  const actualDescription = description || i18n.t`Enjoy free reading resources. Available for everyone. Forever`;

  return (
    <NextHead>
      <title>{actualTitle}</title>
      <meta
        property="og:title"
        content={actualTitle}
      />
      {process.browser &&
        <meta property="og:url" content={window.location.href} />
      }
      <meta name="keywords" content={META.KEYWORDS} />
      <meta name="twitter:site" content={META.TWITTER} />
      <meta name="twitter:card" content="summary" />
      <meta name="description" content={actualDescription} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:type" content={isBookType ? 'book' : 'website'} />
      <meta property="og:site_name" content={META.TITLE} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {children}
    </NextHead>
  );
};

Head.defaultProps = {
  isBookType: false,
};

export default withI18n()(Head);