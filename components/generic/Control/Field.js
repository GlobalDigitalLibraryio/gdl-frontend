/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Field = styled.div`
  &:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

export default class FieldContainer extends React.Component {
  getChildContext() {
    return {
      isInField: true,
    };
  }

  render() {
    return <Field {...this.props} />;
  }
}

FieldContainer.childContextTypes = {
  isInField: PropTypes.bool,
};
