// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Container from '../components/Container';

storiesOf('Container', module).add('Container', () => (
  <div>
    <Container>
      The <strong>container</strong> centers content horizontally
    </Container>
    <Container mw="1075px" mt={50}>
      It also supports a custom max width
    </Container>
  </div>
));
