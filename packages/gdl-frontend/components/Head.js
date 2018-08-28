// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextHead from 'next/head';

const fallBackImgSrc = require('../static/img/apple-touch-icon-192x192.png');

type Props = {|
  description?: string,
  title?: string,
  image?: ?string,
  children?: React.Node
|};

export const DEFAULT_TITLE = 'Global Digital Library';

const Head = ({ title, description, image, children }: Props) => {
  const actualTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const actualDescription =
    description ||
    'Enjoy free reading resources. Available for everyone. Forever';

  return (
    <NextHead>
      <title>{actualTitle}</title>
      <meta property="og:title" content={actualTitle} />
      <meta name="description" content={actualDescription} />
      <meta property="og:description" content={actualDescription} />

      <meta property="og:image" content={image || fallBackImgSrc} />
      {!image && (
        // we know the dimensions of the fallback img
        <>
          <meta property="og:image:width" content="192" />
          <meta property="og:image:height" content="192" />
        </>
      )}
      {children}
    </NextHead>
  );
};

export default Head;
