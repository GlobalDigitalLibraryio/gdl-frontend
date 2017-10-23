// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Hero from '../components/Hero';
import Container from '../components/Container';
import H1 from '../components/H1';
import Card from '../components/Card';

storiesOf('Hero', module)
  .add('Hero', () => (
    <Hero>
      <Container>
        <H1>Hero banner to showcase something</H1>
      </Container>
    </Hero>
  ))
  .add('Colorful hero', () => (
    <Hero colorful>
      <Container>
        <Card textAlign="center">Such colorful hero with a cool gradient</Card>
      </Container>
    </Hero>
  ));
