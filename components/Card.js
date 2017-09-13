// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import tag from 'tag-hoc';

const Base = tag([])('div');

const Card = styled(Base)`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
`;

const CardContent = styled.div`padding: 1rem;`;

const CardAction = styled.button`color: #20588f;`;

export { Card as default, CardContent, CardAction };
