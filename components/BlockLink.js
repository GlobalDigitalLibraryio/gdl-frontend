/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import React from 'react';
import Link from 'next/link';

export default ({ children, ...props }) => (
  <Link>
    <a {...props}>
      {children}
      <style jsx>{`
        a {
          display: inline-block;
          color: #1c5791;
          font-weight: bold;
          text-decoration: none;
        }
        a:after {
          display: block;
          margin-top: 3px;
          height: 4px;
          width: 100%;
          content: '';
          background: #00ccff;
          transition: all 100ms ease-in-out;
        }
        a:hover:after {
          background: #60bb82;
          width: calc(100% + 15px);
        }
      `}</style>
    </a>
  </Link>
);
