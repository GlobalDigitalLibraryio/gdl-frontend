// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import type { $Request, $Response } from 'express';
import type { ApolloClient } from 'react-apollo';

export type Language = {
  +code: string,
  +name: string,
  +isRTL?: boolean
};

export type ConfigShape = {
  publicRuntimeConfig: {
    bookApiUrl: string,
    canonicalUrl: string,
    graphqlEndpoint: string,
    SENTRY_PROJECT_ID: string,
    SENTRY_PUBLIC_KEY: string,
    REPORT_ERRORS: boolean,
    AUTH0: {
      clientId: string,
      audience: string,
      domain: string
    },
    DEFAULT_LANGUAGE: Language,
    googleAnalyticsId: ?string,
    zendeskUrl: string
  },
  // Empty object on the client
  serverRuntimeConfig: {
    bookApiUrl?: string
  }
};

// Disjoint union
type Success<T> = { isOk: true, data: T, statusCode: number };
type Failed = { isOk: false, error: any, statusCode: number };
export type RemoteData<T> = Success<T> | Failed;

export type ImageCropCoordinates = {
  x: number,
  height: number,
  y: number,
  width: number,
  ratio: string,
  revision: number
};

export type CoverImage = {
  url: string,
  alttext?: string,
  imageId: string,
  variants?: { [string]: ImageCropCoordinates }
};

export type Translation = {
  translatedFrom: Language,
  translatedTo: Language,
  id: number,
  crowdinUrl: string,
  synchronizeUrl: string,
  title: string,
  publisher: {
    name: string
  },
  coverImage?: CoverImage
};

export type Context = {
  pathname: string,
  asPath: string,
  query: { [string]: string },
  err?: Error | { statusCode: number },
  res?: $Response,
  req?: $Request,
  apolloClient: ApolloClient
};
