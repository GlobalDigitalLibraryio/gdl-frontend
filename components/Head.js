// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextHead from 'next/head';
import { withI18n } from '@lingui/react';
import type { I18n } from '../types';

const META = {
  TITLE: 'Global Digital Library',
  TITLE_ABBR: 'GDL'
};

type Props = {|
  description?: string,
  title?: string,
  image?: ?string,
  children?: React.Node,
  i18n: I18n
|};

const Head = ({
  title,
  description,
  i18n,
  image,
  isBookType,
  children
}: Props) => {
  const actualTitle = title ? `${META.TITLE_ABBR} - ${title}` : META.TITLE;
  const actualDescription =
    description ||
    i18n.t`Enjoy free reading resources. Available for everyone. Forever`;

  return (
    <NextHead>
      <title>{actualTitle}</title>
      <meta name="description" content={actualDescription} />

      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />

      <meta property="twitter:title" content={actualTitle} />
      <meta property="twitter:description" content={actualDescription} />

      {/* TODO: Add fallback image */}
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="twitter:image" content={image} />}
      {children}
    </NextHead>
  );
};

export default withI18n()(Head);
