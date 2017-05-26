import styled from 'styled-components';
import PropTypes from 'prop-types';

const Control = styled.div`
  font-size: 1rem;
  position: relative;
  text-align: left;

  ${props => (props.expanded ? `
    flex-grow: 1;
    flex-shrink 1;
  ` : null)}
`;

Control.propTypes = {
  expanded: PropTypes.bool,
};

Control.defaultProps = {
  expanded: false,
};

export default Control;

/* ${Group} {
    flex-shrink: 0;

    &:not(:last-child) {
      margin-bottom: 0;
      margin-right: 0.75rem;
    }
  } */
