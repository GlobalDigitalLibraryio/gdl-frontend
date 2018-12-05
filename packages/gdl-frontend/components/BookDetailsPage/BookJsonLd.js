// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { ContributorTypes, type BookDetails } from '../../types';

type Props = {|
  book: BookDetails
|};

export default function BookJsonLd({ book }: Props) {
  // Filter away empty strings
  // const cleanedContributors = book.contributors.filter(c => c.name);

  // const authors = cleanedContributors
  //   .filter(c => c.type === ContributorTypes.AUTHOR)
  //   .map(c => c.name);

  // const illustrators = cleanedContributors
  //   .filter(c => c.type === ContributorTypes.ILLUSTRATOR)
  //   .map(c => c.name);

  // const translators = cleanedContributors
  //   .filter(c => c.type === ContributorTypes.TRANSLATOR)
  //   .map(c => c.name);

  // // Photograpgher isn't part of the schema for books, so lump them together with other contributors
  // const contributors = cleanedContributors
  //   .filter(
  //     c =>
  //       c.type === ContributorTypes.CONTRIBUTOR ||
  //       c.type === ContributorTypes.PHOTOGRAPHER
  //   )
  //   .map(c => c.name);

  // Use 'undefined' instead of 'null' here, as undefined fields are removed by json stringify
  const data = {
    '@context': 'http://schema.org/',
    '@type': 'WebPage',
    mainEntity: {
      '@id': book.uuid,
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
      author: book.authors,
      illustrator: book.illustrators,
      translator: book.translators,
      // Photograpgher isn't part of the schema for books, so lump them together with other contributors
      contributor: book.photographers
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
