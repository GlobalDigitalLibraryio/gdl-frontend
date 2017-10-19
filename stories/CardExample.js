// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Container from '../components/Container';

storiesOf('Card', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Simple card', () => <Card>This is a card</Card>);
