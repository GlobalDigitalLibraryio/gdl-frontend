// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'react-emotion';
import {TABLET_BREAKPOINT} from "./misc";

/**
 * Mobile first media template
 *
 * (Also has a mobile only query)
 *
 */

// A function returning a function :)
const query = (condition: 'min' | 'max', width: number) => (
  // $FlowFixMe Flow doesn't play nice with template literals https://github.com/facebook/flow/issues/2616
  ...args
) => css`
  @media (${condition}-width: ${width}px) {
    ${css(...args)};
  }
`;

const media = {
  mobile: query('max', TABLET_BREAKPOINT - 1),
  tablet: query('min', TABLET_BREAKPOINT)
};

export default media;
