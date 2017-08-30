/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import { css } from 'styled-components';

const deviceSizes = {
  desktop: 1000,
  tablet: 769,
  mobile: 768,
};

export default Object.entries(deviceSizes).reduce((acc, [device, size]) => {
  acc[device] = (...args) => css`
    @media screen and (${device === 'mobile'
        ? 'max'
        : 'min'}-width: ${size}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});
