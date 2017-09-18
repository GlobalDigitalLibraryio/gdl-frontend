// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { configure } from '@storybook/react';
import { injectGlobal } from 'styled-components';
import { globalStyles } from '../pages/_document';
import Container from '../components/Container';

injectGlobal`${globalStyles}`;

configure(() => require('../stories'), module);
