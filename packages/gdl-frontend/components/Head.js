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

const fallBackImgSrc = require('../static/img/apple-icon-144x144-precomposed.png');

type Props = {|
  description?: string,
  title?: string,
  image?: ?string,
  children?: React.Node,
  i18n: I18n
|};

export const DEFAULT_TITLE = 'Global Digital Library';

const Head = ({ title, description, i18n, image, children }: Props) => {
  const actualTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
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

      <meta property="og:image" content={image || fallBackImgSrc} />
      <meta property="twitter:image" content={image || fallBackImgSrc} />
      {children}
    </NextHead>
  );
};

export default withI18n()(Head);
