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
import Title from '../components/Title';
import Card from '../components/Card';

storiesOf('Hero', module)
  .add('Hero', () => (
    <Hero>
      <Container>
        <Title>Hero banner to showcase something</Title>
      </Container>
    </Hero>
  ))
  .add('Bordered Hero', () => (
    <div>
      <Hero borderTop borderBottom>
        <Container>
          <Title>Hero banner with top and bottom borders</Title>
        </Container>
      </Hero>
      <Hero borderBottom>
        <Container>
          <Title>Hero banner with bottom border</Title>
        </Container>
      </Hero>
    </div>
  ))
  .add('Colorful hero', () => (
    <Hero colorful>
      <Container>
        <Card style={{ textAlign: 'center' }}>
          Such colorful hero with a cool gradient
        </Card>
      </Container>
    </Hero>
  ));
