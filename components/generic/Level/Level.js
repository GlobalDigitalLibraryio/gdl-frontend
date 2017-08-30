import styled from 'styled-components';
import PropTypes from 'prop-types';
import LevelItem from './LevelItem';
import media from '../helpers/media';

const Level = styled.div`
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  ${props => (props.mobile ? 'display: flex;' : media.tablet`display: flex;`)};
`;

Level.propTypes = {
  mobile: PropTypes.bool // By default, level items stack on mobile. Set this if you do not want that
};

Level.defaultProps = {
  mobile: false
};

Level.Item = LevelItem;

export default Level;
