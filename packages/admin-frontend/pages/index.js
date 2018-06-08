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
        <Link href="/crop">
          <a>Crop images</a>
        </Link>
      </div>
    );
  }
}

export default IndexPage;
