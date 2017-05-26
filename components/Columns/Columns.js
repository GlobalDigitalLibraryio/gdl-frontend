import styled from 'styled-components';
import PropTypes from 'prop-types';

const Columns = styled.div`
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

  @media screen and (min-width: 769px) {
    display: flex;
  }
`;

Columns.propTypes = {
  centered: PropTypes.bool, // Horizontal centering
  vCentered: PropTypes.bool, // Vertical centering
  multiline: PropTypes.bool, // Wrap across multiple columns/rows
};

Columns.defaultProps = {
  centered: false,
  vCentered: false,
  multiline: false,
};

export const ColumnsMobile = Columns.extend`
  display: flex;
`;

export default Columns;
