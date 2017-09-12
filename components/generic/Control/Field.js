/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
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
