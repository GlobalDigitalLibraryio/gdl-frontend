// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { injectGlobal } from 'styled-components';
import { globalStyles } from '../pages/_document';
import { Theme } from '../hocs/withTheme';

injectGlobal`${globalStyles}`;

addDecorator(story => <Theme>{story()}</Theme>);

configure(() => require('../stories'), module);
