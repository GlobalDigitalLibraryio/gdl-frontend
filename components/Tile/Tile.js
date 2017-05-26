import styled from 'styled-components';
import PropTypes from 'prop-types';

const Tile = styled.div`
  display: block;
  min-height: min-content;
  align-items: stretch;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;

  ${props => (props.ancestor ? `
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    margin-top: -0.75rem;
    &:last-child {
      margin-bottom: -0.75rem;
    }
    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  ` : null)}
  
  ${props => (props.parent ? `
    padding: 0.75rem;
  ` : null)}
  
  ${props => (props.child ? `
    margin: 0 !important;
  ` : '@media screen and (min-width: 769px) { display: flex; }')}
  
  @media screen and (min-width: 769px) {
    ${props => (props.size ? `
      flex: none;
      width: ${props.size / 12 * 100}%;
    ` : null)}
  }
  
`;

Tile.propTypes = {
  ancestor: PropTypes.bool,
  parent: PropTypes.bool,
  child: PropTypes.bool,
  size: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
};

Tile.defaultProps = {
  ancestor: false,
  parent: false,
  child: false,
  size: null,
};

export default Tile;
