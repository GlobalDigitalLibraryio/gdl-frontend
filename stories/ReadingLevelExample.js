// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ReadingLevel from '../components/ReadingLevel';
import Container from '../components/Container';

storiesOf('ReadingLevel', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add('ReadingLevel', () => <ReadingLevel>Level 1</ReadingLevel>);
