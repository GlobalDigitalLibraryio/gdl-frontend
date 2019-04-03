// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import serializer from 'jest-emotion';
import BookJsonLd from '../BookJsonLd';

// $FlowFixMe flow type is not correct for serializer
expect.addSnapshotSerializer(serializer);

const bookBase = {
  id: 'abc123',
  title: 'A Life in the Fair Jungle',
  description:
    'Sindi buzzes with colorful songs and dance. Will starting school end all that?',
  license: {
    url: 'https://creativecommons.org/licenses/by/4.0/'
  },
  language: {
    code: 'eng'
  },
  publisher: {
    name: 'Pratham Books'
  },
  coverImage: null,
  authors: null,
  photographers: null,
  translators: null,
  illustrators: null
};

test('Without coverImage and contributors', () => {
  const tree = shallow(<BookJsonLd book={bookBase} />);

  expect(toJson(tree)).toMatchSnapshot();
});

test('With coverImage', () => {
  const book = {
    ...bookBase,
    coverImage: {
      url:
        'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg'
    }
  };

  const tree = shallow(<BookJsonLd book={book} />);

  expect(toJson(tree)).toMatchSnapshot();
});

test('With contributors', () => {
  const book = {
    ...bookBase,
    illustrators: [{ name: 'Mrs. Drawer' }, { name: 'Son of Mrs. Drawer' }],
    authors: [{ name: 'Ms Writer' }]
  };

  const tree = shallow(<BookJsonLd book={book} />);

  expect(toJson(tree)).toMatchSnapshot();
});
