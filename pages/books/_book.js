/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

// @flow
import * as React from 'react';
import { Trans } from 'lingui-react';
import withI18n from '../../hocs/withI18n';

type Props = {
  book: {
    id: string,
  },
};

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    return {
      book: {
        id: query.id,
      },
    };
  }

  render() {
    return <Trans id="book.id">Book id: {this.props.book.id}</Trans>;
  }
}

export default withI18n(BookPage);
