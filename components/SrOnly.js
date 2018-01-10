// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { hideVisually } from 'polished';

// A component whose content is only visible to screen readers
const SrOnly = styled('span')(hideVisually);

export default SrOnly;
