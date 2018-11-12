// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setConfig } from 'next/config';

import { publicRuntimeConfig } from './config';

// Make sure we can use "publicRuntimeConfig" within tests.
setConfig({ publicRuntimeConfig });

Enzyme.configure({ adapter: new Adapter() });
