import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Columns, { ColumnsMobile } from './Columns';

const sizes = {
  desktop: 1000,
  tablet: 769,
  mobile: 768,
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media screen and (${label === 'mobile' ? 'max' : 'min'}-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

const Column = styled.div`
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;

  ${Columns} {
    ${props => (props.size ? media.tablet`
      flex: none;
      width: ${props.size / 12 * 100}%;
    ` : null)}
  }

  ${props => (props.mobile ? media.mobile`
    flex: none;
    width: ${props.mobile / 12 * 100}%;
  ` : null)}

  ${props => (props.tablet ? media.tablet`
    flex: none;
    width: ${props.tablet / 12 * 100}%;
  ` : null)}
  
  ${props => (props.desktop ? media.desktop`
    flex: none;
    width: ${props.desktop / 12 * 100}%;
  ` : null)}
`;

const sizePropType = PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

Column.propTypes = {
  size: sizePropType, // Column size for all viewports (unless overidden by specific viewport)
  mobile: sizePropType, // Column size for mobile (max width)
  tablet: sizePropType, // Column size for tablet (min width)
  desktop: sizePropType, // Column size for desktop (min width)
  full: PropTypes.bool, // 100% width on all viewports
  mobileFull: PropTypes.bool, // 100% width on mobile only
  tabletFull: PropTypes.bool, // 100% with on tablet only
  desktopFull: PropTypes.bool, // 100% width on desktop only
};

export default Column;
