// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { I18nProvider } from '@lingui/react';
import { mount } from 'enzyme';
import PageNavigation from '../PageNavigation';

function mountWithI18n(node) {
  return mount(<I18nProvider>{node}</I18nProvider>);
}

test('that we can navigate pages with the buttons', () => {
  const previousChapter = jest.fn();
  const nextChapter = jest.fn();

  const tree = mountWithI18n(
    <PageNavigation
      onRequestNextChapter={nextChapter}
      onRequestPreviousChapter={previousChapter}
      disableNext={false}
      disablePrevious={false}
    />
  );

  tree
    .find('button')
    .first()
    .simulate('click');
  expect(previousChapter).toHaveBeenCalledTimes(1);

  tree
    .find('button')
    .last()
    .simulate('click');
  expect(nextChapter).toHaveBeenCalledTimes(1);
});

test('that navigation accounts for RTL languages', () => {
  const previousChapter = jest.fn();
  const nextChapter = jest.fn();

  const tree = mountWithI18n(
    <PageNavigation
      onRequestNextChapter={nextChapter}
      onRequestPreviousChapter={previousChapter}
      isRtlLanguage
      disableNext={false}
      disablePrevious={false}
    />
  );

  /**
   * Notice that the "first" button should now call nextChapter.
   * Opposite of previous test
   */

  tree
    .find('button')
    .first()
    .simulate('click');
  expect(nextChapter).toHaveBeenCalledTimes(1);

  tree
    .find('button')
    .last()
    .simulate('click');
  expect(previousChapter).toHaveBeenCalledTimes(1);
});

test('that navigation is disabled', () => {
  const previousChapter = jest.fn();
  const nextChapter = jest.fn();

  const tree = mountWithI18n(
    <PageNavigation
      onRequestNextChapter={nextChapter}
      onRequestPreviousChapter={previousChapter}
      isRtlLanguage
      disableNext
      disablePrevious
    />
  );

  /**
   * Notice that the "first" button should now call nextChapter.
   * Opposite of previous test
   */

  tree
    .find('button')
    .first()
    .simulate('click');
  expect(nextChapter).toHaveBeenCalledTimes(0);

  tree
    .find('button')
    .last()
    .simulate('click');
  expect(previousChapter).toHaveBeenCalledTimes(0);
});
