// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import Head from 'next/head';

type Props = {
  description: string,
  title: string,
  image?: ?string,
};

export default (props: Props) => (
  <Head>
    <title>{props.title} - Global Digital Library</title>
    <meta
      property="og:title"
      content={`${props.title} - Global Digital Library`}
    />
    <meta name="description" content={props.description} />
    {props.image && <meta property="og:image" content={props.image} />}
  </Head>
);
