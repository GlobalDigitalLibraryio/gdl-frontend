// @flow
import React from 'react';
import ContentLoader from 'react-content-loader';

export default ({ className, id }: { className: ?string, id: string }) => (
  <ContentLoader className={className} height="200" width="130" speed={3}>
    <rect x="0" y="0" rx="0" ry="0" height="160" width="130" />
    <rect x="0" y="162" rx="0" ry="0" width="130" height="40" />
  </ContentLoader>
);
