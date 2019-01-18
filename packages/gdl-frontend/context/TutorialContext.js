// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import {
  clearTutorial,
  setFinishedHomeTutorial,
  setFinishedBookDetailsTutorial,
  getBookDetailsTutorialStatus,
  getHomeTutorialStatus
} from '../lib/storage';

const withTutorialContext = (Component: React.ComponentType<*>) => {
  return (props: any) => (
    <TutorialContext.Consumer>
      {state => <Component {...props} context={state} />}
    </TutorialContext.Consumer>
  );
};

type TutorialState = {
  homePageStatus: boolean,
  bookDetailStatus: boolean
};

const TutorialContext = React.createContext<TutorialState>({
  homePageStatus: getHomeTutorialStatus(),
  bookDetailStatus: getBookDetailsTutorialStatus()
});

class TutorialProvider extends React.Component<*, TutorialState> {
  state = {
    homePageStatus: getHomeTutorialStatus(),
    bookDetailStatus: getBookDetailsTutorialStatus()
  };

  onFinishHomeTutorial = () => {
    setFinishedHomeTutorial(() => this.setState({ homePageStatus: true }));
  };

  onFinishedBookDetailsTutorial = () => {
    setFinishedBookDetailsTutorial(() =>
      this.setState({ bookDetailStatus: true })
    );
  };

  onClearTutorial = () => clearTutorial();

  resetTutorialStatus = () => {
    const noTutorialCookies =
      !getHomeTutorialStatus() && !getBookDetailsTutorialStatus();

    noTutorialCookies &&
      this.setState({ homePageStatus: false, bookDetailStatus: false });
  };

  render() {
    return (
      <TutorialContext.Provider
        value={{
          ...this.state,
          homePageTutorialInProgress: !this.state.homePageStatus,
          resetTutorialStatus: this.resetTutorialStatus,
          onClearTutorial: this.onClearTutorial,
          onFinishHomeTutorial: this.onFinishHomeTutorial,
          onFinishedBookDetailsTutorial: this.onFinishedBookDetailsTutorial
        }}
      >
        {this.props.children}
      </TutorialContext.Provider>
    );
  }
}

export { TutorialContext, TutorialProvider, withTutorialContext };
