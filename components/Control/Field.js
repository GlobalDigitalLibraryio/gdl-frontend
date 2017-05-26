import React from 'react';
import PropTypes from 'prop-types';

export default class Field extends React.Component {
  getChildContext() {
    return {
      isInField: true,
    };
  }

  render() {
    return <div {...this.props} />;
  }
}

Field.childContextTypes = {
  isInField: PropTypes.bool,
};
