// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import {
  LANGUAGE_SUPPORT_QUERY,
  HOME_CONTENT_QUERY,
  CATEGORIES_QUERY
} from '../index';
import { withErrorPage } from '../../hocs';
import VideoPage from '../../components/VideoPage';
import {
  getBookLanguageCode,
  getBookCategory,
  setBookLanguageAndCategory
} from '../../lib/storage';
import { throwIfGraphql404 } from '../../utils/errorHandler';
import { AMOUNT_OF_ITEMS_PER_LEVEL } from '../../components/HomePage';

import type { Context } from '../../types';

export const PAGE_SIZE = 30;

type Props = {|
  languageCode: string,
|};

const VideoIndexPage = ({ languageCode }: Props) => (
  <VideoPage languageCode={languageCode} />
);

VideoIndexPage.getInitialProps = async ({
  query,
  asPath,
  req,
  res,
  apolloClient
}: Context) => {
  try {
    // Get the language either from the URL or the user's cookies
    const languageCode = query.lang || getBookLanguageCode(req);
    console.log("la langue: ", languageCode)
    return {languageCode}

  } catch (error) {
    throwIfGraphql404(error);
    return { statusCode: 500 };
  }
}

export default VideoIndexPage;