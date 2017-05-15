import React from 'react';

export default ({ children, ...props }) => (
  <div className="container" {...props}>
    {children}
    <style jsx>{`
      .container {
        position: relative;
      }
      @media screen and (min-width: 1000px) {
      .container {
        margin: 0 auto;
        max-width: 960px;
        width: 960px;
        }
      }
      @media screen and (min-width: 1192px) {
        .container {
          max-width: 1152px;
          width: 1152px;
        }
      }
      @media screen and (min-width: 1384px) {
        .container {
          max-width: 1344px;
          width: 1344px;
        }
      }
    `}</style>
  </div>
);
