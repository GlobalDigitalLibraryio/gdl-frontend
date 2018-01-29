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
import Button from '../components/Button';

storiesOf('Button', module).add('Button', () => (
  <Container mt={100}>
    <Button>Read book</Button>
  </Container>
));
