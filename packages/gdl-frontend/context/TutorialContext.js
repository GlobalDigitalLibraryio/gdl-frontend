import * as React from 'react';
import {
  clearTutorial,
  setFinishedHomeTutorial,
  setFinishedBookDetailsTutorial,
  getBookDetailsTutorialStatus,
  getHomeTutorialStatus
} from '../lib/storage';

const withTutorialContext = Component => {
  return props => (
    <TutorialContext.Consumer>
      {state => <Component {...props} context={state} />}
    </TutorialContext.Consumer>
  );
};

const TutorialContext = React.createContext({
  homePageStatus: getHomeTutorialStatus(),
  bookDetailStatus: getBookDetailsTutorialStatus()
});

class TutorialProvider extends React.Component<*> {
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
