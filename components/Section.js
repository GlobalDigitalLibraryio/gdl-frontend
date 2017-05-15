import React from 'react';

export default ({ children, ...props }) => (
  <section className="section" {...props}>
    {children}
    <style jsx>{`
      .section {
        padding: 3rem 1.5rem;
      }
    `}</style>
  </section>
);
