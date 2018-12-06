// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';

type Props = {|
  book: $ReadOnly<{
    id: string,
    title: string,
    language: {
      code: string
    },
    coverImage: ?{
      url: string
    },
    description: string,
    publisher: { name: string },
    authors: ?Array<{ name: string }>,
    illustrators: ?Array<{ name: string }>,
    translators: ?Array<{ name: string }>,
    photographers: ?Array<{ name: string }>,
    license: { url: string }
  }>
|};

export default function BookJsonLd({ book }: Props) {
  // Use 'undefined' instead of 'null' here, as undefined fields are removed by json stringify

  const data = {
    '@context': 'http://schema.org/',
    '@type': 'WebPage',
    mainEntity: {
      '@id': book.id,
      '@type': 'Book',
      isFamilyFriendly: true,
      bookFormat: 'EBook',
      inLanguage: book.language.code,
      isAccessibleForFree: true,
      name: book.title,
      description: book.description,
      publisher: book.publisher.name,
      license: book.license.url,
      image: book.coverImage ? book.coverImage.url : undefined,
      author: transformContributors(book.authors),
      illustrator: transformContributors(book.illustrators),
      translator: transformContributors(book.translators),
      // Photograpgher isn't part of the schema for books, so lump them together with other contributors
      contributor: transformContributors(book.photographers)
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function transformContributors(
  contributors: ?Array<{ name: string }>
): Array<string> | string | void {
  if (contributors) {
    const mapped = contributors.map(c => c.name);
    if (mapped.length === 1) {
      return mapped[0];
    }
    return mapped;
  }
  return undefined;
}
