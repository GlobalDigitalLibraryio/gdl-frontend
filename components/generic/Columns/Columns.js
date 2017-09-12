/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import media from '../helpers/media';

const ColumnsContainer = ({
  centered,
  children,
  vCentered,
  multiline,
  responsive,
  ...props
}) => (
  <div {...props}>
    {React.Children.map(children, column =>
      React.cloneElement(column, { responsive }),
    )}
  </div>
);

ColumnsContainer.propTypes = {
  centered: PropTypes.bool.isRequired,
  vCentered: PropTypes.bool.isRequired,
  multiline: PropTypes.bool.isRequired,
  responsive: PropTypes.oneOf(['mobile', 'tablet', 'desktop']).isRequired, // By default columns are stacked on mobile, and starts from tablets and upwards.
};

const Columns = styled(ColumnsContainer)`
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;

  &:last-child {
    margin-bottom: -0.75rem;
  }

  &:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  flex-wrap: ${props => (props.multiline ? 'wrap' : 'nowrap')};
  justify-content: ${props => (props.centered ? 'center' : 'flex-start')};
  align-items: ${props => (props.vCentered ? 'center' : 'stretch')};

  ${props =>
    props.responsive === 'mobile'
      ? 'display:flex;'
      : media[props.responsive]`display:flex;`};
`;

Columns.propTypes = {
  centered: PropTypes.bool, // Horizontal centering
  vCentered: PropTypes.bool, // Vertical centering
  multiline: PropTypes.bool, // Wrap across multiple columns/rows
  responsive: PropTypes.oneOf(['mobile', 'tablet', 'desktop']), // By default columns are stacked on mobile, and starts from tablets and upwards.
};

Columns.defaultProps = {
  centered: false,
  vCentered: false,
  multiline: false,
  responsive: 'tablet',
};

export default Columns;
