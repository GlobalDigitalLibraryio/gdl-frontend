/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import styled from 'styled-components';
import PropTypes from 'prop-types';
import media from '../helpers/media';

const LevelItem = styled.div`
  align-items: center;
  display: flex;
  flex-basis: auto;
  flex-grow: ${props => (props.narrow ? '0' : '1')};
  flex-shrink: 0;
  justify-content: center;

  ${media.mobile`
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  `};
`;

LevelItem.propTypes = {
  narrow: PropTypes.bool,
};

LevelItem.defaultProps = {
  narrow: false,
};

export default LevelItem;
