/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

import React from 'react';

const Card = ({ children, ...props }) => (
  <div {...props}>
    {children}
    <style jsx>{`
      div {
        background-color: white;
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
          0 0 0 1px rgba(10, 10, 10, 0.1);
        color: #4a4a4a;
        max-width: 100%;
        position: relative;
      }
    `}</style>
  </div>
);

const CardContent = ({ children, ...props }) => (
  <div {...props}>
    {children}
    <style jsx>{`
      div {
        padding: 1.5rem;
      }
    `}</style>
  </div>
);

Card.Content = CardContent;

export default Card;
