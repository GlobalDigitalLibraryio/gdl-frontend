/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import styled from 'styled-components';
import CardContent from './CardContent';
import CardImage from './CardImage';

const Card = styled.div`
  background-color: white;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
  max-width: 100%;
  position: relative;
`;

Card.Content = CardContent;
Card.Image = CardImage;

export default Card;
