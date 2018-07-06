// @flow
import React from 'react';

const Container = (props: {}) => (
  <div
    css={{
      maxWidth: '960px',
      paddingLeft: 16,
      paddingRight: 16
    }}
    {...props}
  />
);

export default Container;
