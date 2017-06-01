import styled from 'styled-components';
import media from '../helpers/media';

const LevelItem = styled.div`
  align-items: center;
  display: flex;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;

  ${media.mobile`
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  `}
`;

export default LevelItem;
