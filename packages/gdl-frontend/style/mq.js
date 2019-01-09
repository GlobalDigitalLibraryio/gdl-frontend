// @flow
import facepaint from 'facepaint';
import { TABLET_BREAKPOINT, LARGER_TABLET_BREAKPOINT } from './theme/misc';

export default facepaint([
  `@media(min-width: ${TABLET_BREAKPOINT}px)`,
  `@media(min-width: ${LARGER_TABLET_BREAKPOINT}px)`
]);
