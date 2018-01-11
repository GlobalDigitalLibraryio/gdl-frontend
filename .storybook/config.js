// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { injectGlobal } from 'emotion';
import globalStyles from '../style/globalStyles';
import { Theme } from '../hocs/withTheme';

injectGlobal`${globalStyles}`;

addDecorator(story => <Theme>{story()}</Theme>);

configure(() => require('../stories'), module);
