// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { css } from '@emotion/core';
import mq from '../style/mq';

type Props = {
  className?: string,
  only: 'mobile' | 'tablet' | 'mobileAndTablet' | 'desktop'
};

const mobile = css(mq({ display: [null, 'none', 'none'] }));
const tablet = css(mq({ display: ['none', 'inherit', 'inherit'] }));
const mobileAndTablet = css(mq({ display: ['inherit', 'inherit', 'none'] }));
const desktop = css(mq({ display: ['none', 'none', 'inherit'] }));

/**
 * Only render on the given type
 */
const Hidden = ({ only, ...props }: Props) => {
  let style;
  switch (only) {
    case 'mobile':
      style = mobile;
      break;
    case 'tablet':
      style = tablet;
      break;
    case 'mobileAndTablet':
      style = mobileAndTablet;
      break;
    case 'desktop':
      style = desktop;
      break;
    default:
      style = desktop;
  }
  return <div css={style} {...props} />;
};

export default Hidden;
