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

const Column = styled.div`
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;

  ${props =>
    props.mobile && props.responsive === 'mobile'
      ? media.mobile`
    flex: none;
    width: ${props.mobile / 12 * 100}%;
  `
      : null} ${props =>
      props.tablet && props.responsive !== 'desktop'
        ? media.tablet`
    flex: none;
    width: ${props.tablet / 12 * 100}%;
  `
        : null} ${props =>
      props.desktop
        ? media.desktop`
    flex: none;
    width: ${props.desktop / 12 * 100}%;
  `
        : null};
`;

const sizePropType = PropTypes.oneOf([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
]);

Column.propTypes = {
  mobile: sizePropType, // Column size for mobile (max width) only applies if Columns.responsive === mobile
  tablet: sizePropType, // Column size for tablet (min width) only applies if Columns.responsive === tablet (default)
  desktop: sizePropType, // Column size for desktop (min width)
  responsive: PropTypes.oneOf(['mobile', 'tablet', 'desktop']).isRequired,
};

Column.defaultProps = {
  responsive: 'tablet',
};

export default Column;
