/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import styled from 'styled-components';
import PropTypes from 'prop-types';

const Control = styled.div`
  font-size: 1rem;
  position: relative;
  text-align: left;

  ${props =>
    props.expanded
      ? `
    flex-grow: 1;
    flex-shrink 1;
  `
      : null};
`;

Control.propTypes = {
  expanded: PropTypes.bool,
};

Control.defaultProps = {
  expanded: false,
};

export default Control;
