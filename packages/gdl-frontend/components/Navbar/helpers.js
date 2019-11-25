// @flow
/**
 * Since the application can't get react hooks to work, I reverse engineered:
 * https://github.com/mui-org/material-ui/blob/89687f38cae750650555772ba4d821c9084d8dfc/packages/material-ui/src/useScrollTrigger/useScrollTrigger.js
 */

// Change the trigger value when the vertical scroll strictly crosses this threshold
const THRESHOLD = 100;

function getScrollY(ref: any): number {
  return ref.pageYOffset !== undefined ? ref.pageYOffset : ref.scrollTop;
}

export function getTrigger(
  event: ?SyntheticEvent<HTMLDivElement>,
  ref: Object
): boolean {
  const previous = ref.current;
  ref.current = event ? getScrollY(event.currentTarget) : previous;

  if (previous !== undefined) {
    if (ref.current < previous) {
      return false;
    }
  }

  return ref.current > THRESHOLD;
}
