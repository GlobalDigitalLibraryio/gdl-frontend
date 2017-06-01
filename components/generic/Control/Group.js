import styled from 'styled-components';
import Field from './Field';
import Control from './Control';

/**
 * Group controls (buttons, input) together with nice spacing between them
 */
export default styled(Field)`
  display: flex;
  justify-content: flex-start;

  ${Control} {
    flex-shrink: 0;

    &:not(:last-child) {
      margin-bottom: 0;
      margin-right: 0.75rem;
    }
  }
`;
