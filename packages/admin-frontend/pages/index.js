// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Link from 'next/link';

class IndexPage extends React.Component<{}> {
  render() {
    return (
      <div>
        <h1>GDL Admin</h1>

        <div>
          <Link prefetch href="/admin/crop">
            <a>Crop images</a>
          </Link>
        </div>
        <div>
          <Link prefetch href="/admin/edit">
            <a>Edit book</a>
          </Link>
        </div>
        <div>
          <Link prefetch href="/admin/flagged">
            <a>Flagged books</a>
          </Link>
        </div>
      </div>
    );
  }
}

export default IndexPage;
