import * as React from 'react';
import UniversalCookie from 'universal-cookie';

const BOOKDETAILS_TUTORIAL_STATUS_KEY = 'bookDetailsTutorialFinished';
const HOME_TUTORIAL_STATUS_KEY = 'homeTutorialFinished';

const sixMonthsInSeconds = 60 * 60 * 24 * 30 * 6; // approximately

const cookies = () => new UniversalCookie();

const SIX_MONTHS_OPTIONS = {
  maxAge: sixMonthsInSeconds,
  path: '/'
};

function getHomeTutorialStatus() {
  const hasFinished = cookies().get(HOME_TUTORIAL_STATUS_KEY, {
    doNotParse: false
  });
  return hasFinished || false;
}

function getBookDetailsTutorialStatus() {
  const hasFinished = cookies().get(BOOKDETAILS_TUTORIAL_STATUS_KEY, {
    doNotParse: false
  });
  return hasFinished || false;
}

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
    const c = cookies();
    c.set(HOME_TUTORIAL_STATUS_KEY, true, SIX_MONTHS_OPTIONS);
    this.setState({ homePageStatus: true });
  };

  onFinishedBookDetailsTutorial = () => {
    const c = cookies();
    c.set(BOOKDETAILS_TUTORIAL_STATUS_KEY, true, SIX_MONTHS_OPTIONS);
    this.setState({ bookDetailStatus: true });
  };

  onClearTutorial = () => {
    const c = cookies();
    c.remove(HOME_TUTORIAL_STATUS_KEY);
    c.remove(BOOKDETAILS_TUTORIAL_STATUS_KEY);
  };

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
