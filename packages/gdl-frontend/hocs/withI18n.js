// @flow
import * as React from 'react';
import { withI18n } from '@lingui/react';

import type { Context } from '../types';

/**
 * The original withI18n HOC from Lingui doesn't hoist statics (getInitialProps),
 * so in order to use them on next pages we do this ourselves with this little wrapper component
 */
export default (Page: React.ComponentType<*>) => {
  const PageWithI18n = withI18n()(Page);

  return class I18n extends React.Component<*> {
    static getInitialProps(ctx: Context) {
      return (
        // $FlowFixMe: Next static method on the React component type
        typeof Page.getInitialProps === 'function' && Page.getInitialProps(ctx)
      );
    }

    render() {
      return <PageWithI18n {...this.props} />;
    }
  };
};
