// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import * as React from 'react';

const Img = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

const NO_COVER_PLACEHOLDER_URL = '/static/placeholder-cover.png';

/**
 * Use for book covers. Renders a placeholder if no image is passed
 */
export default ({ src, alt }: { src: ?string, alt: string }) => (
  <Img src={src || NO_COVER_PLACEHOLDER_URL} alt={alt} aria-hidden />
);
