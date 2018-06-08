// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Crop from './crop';

class IndexPage extends React.Component<{}> {
  render() {
    return <div>
      <Crop />
      <a id="image-api-url">Link to image-api</a>
      </div>;
  }
}

export default IndexPage;
