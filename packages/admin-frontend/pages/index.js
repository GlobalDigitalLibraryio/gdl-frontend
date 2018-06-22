// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Link from 'next/link';

class IndexPage extends React.Component<{}> {
  render() {
    return (
      <main>
        <h1>GDL Admin</h1>
        <div>
          <Link prefetch href="/admin/crop">
            <a>Crop images</a>
          </Link>
        </div>
        <div>
          <Link href="/admin/export">
            <a>Export books from language and source</a>
          </Link>
        </div>
        <div>
          <Link prefetch href="/admin/edit">
            <a>Edit book</a>
          </Link>
        </div>
        <div>
          <Link href="/admin/edit_featured_content">
            <a>Edit featured content</a>
          </Link>
        </div>
      </main>
    );
  }
}

export default IndexPage;
