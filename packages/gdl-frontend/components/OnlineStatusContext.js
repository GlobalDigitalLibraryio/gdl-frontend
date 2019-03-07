// @flow
import * as React from 'react';

const OnlineStatusContext = React.createContext<boolean>(true);
export default OnlineStatusContext;

// OnlineStatusContext as a HoC. Hooks will make this so much nicer
export function withOnlineStatusContext<Props: {}>(
  Component: React.ComponentType<Props>
): React.ComponentType<$Diff<Props, { online: boolean | void }>> {
  return function WrapperComponent(props: Props) {
    return (
      <OnlineStatusContext.Consumer>
        {online => <Component {...props} online={online} />}
      </OnlineStatusContext.Consumer>
    );
  };
}
