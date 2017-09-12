// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

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
