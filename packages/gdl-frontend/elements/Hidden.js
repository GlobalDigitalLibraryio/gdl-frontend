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
  only: 'mobile' | 'tablet'
};

const mobile = css(mq({ display: [null, 'none', 'none'] }));
const tablet = css(mq({ display: ['none', 'inherit', 'inherit'] }));

/**
 * Only render on the given type
 */
const Hidden = ({ only, ...props }: Props) => {
  const style = only === 'mobile' ? mobile : tablet;
  return <div css={style} {...props} />;
};

export default Hidden;
