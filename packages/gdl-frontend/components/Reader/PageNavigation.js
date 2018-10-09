// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@material-ui/icons';
import { I18n } from '@lingui/react';
import Swipeable from 'react-swipeable';
import styled from 'react-emotion';

import KeyDown from '../KeyDown';
import { colors } from '../../style/theme';
import media from '../../style/media';

/**
 * How long do we show the button overlay on mobile when tapping the screen.
 */
const OVERLAY_TIMEOUT = 3000; // 3 seconds.

type Props = {
  className?: string,
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void,
  disableNext: boolean,
  disablePrevious: boolean,
  isRtlLanguage?: boolean,
  children?: React.Node
};

export default class PageNavigation extends React.Component<
  Props,
  { showNavigationButtons: boolean }
> {
  timerId: number;

  state = {
    showNavigationButtons: false // This is only changed when tapping
  };

  componentWillUnmount() {
    // Make sure we clean up after ourselves so we don't try to setState after we've unmounted
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  }

  onTap = (event: SyntheticTouchEvent<HTMLElement>) => {
    // If we clicked a button, ignore the tap
    // $FlowFixMe: Not sure why Flow complains here
    if (event.target.type === 'button') {
      return;
    }

    // Toggle the overlay and clear/set timer accordingly
    this.setState(
      state => ({ showNavigationButtons: !state.showNavigationButtons }),
      () => {
        if (this.state.showNavigationButtons) {
          this.timerId = window.setTimeout(
            () => this.setState({ showNavigationButtons: false }),
            OVERLAY_TIMEOUT
          );
        } else {
          window.clearTimeout(this.timerId);
        }
      }
    );
  };

  render() {
    let {
      className,
      onRequestNextChapter,
      onRequestPreviousChapter,
      disableNext,
      disablePrevious,
      isRtlLanguage
    } = this.props;

    /**
     * In RTL languages such as arabic we flip around the navigation
     */
    if (isRtlLanguage) {
      onRequestNextChapter = this.props.onRequestPreviousChapter;
      onRequestPreviousChapter = this.props.onRequestNextChapter;
      disableNext = this.props.disablePrevious;
      disablePrevious = this.props.disableNext;
    }

    return (
      <>
        {/* It is important that Swipable includes the Buttons, so we can start swiping all the way from edge of the screens */}
        <Swipeable
          className={className}
          onSwipedLeft={onRequestNextChapter}
          onSwipedRight={onRequestPreviousChapter}
          onTap={this.onTap}
        >
          {this.props.children}
          <NavigationButtons
            showNavigationButtons={this.state.showNavigationButtons}
            onRequestNextChapter={onRequestNextChapter}
            onRequestPreviousChapter={onRequestPreviousChapter}
            disableNext={disableNext}
            disablePrevious={disablePrevious}
            isRtlLanguage={isRtlLanguage}
          />
        </Swipeable>
        <KeyDown
          when="ArrowRight"
          then={onRequestNextChapter}
          disabled={disableNext}
        />
        <KeyDown
          when="ArrowLeft"
          then={onRequestPreviousChapter}
          disabled={disablePrevious}
        />
      </>
    );
  }
}

/**
 * These buttons are always visible on >= tablet. On mobile they are briefly visible.
 * They are hidden with opacity, so you can tap the sides of the screen to navigate
 */
const NavigationButtons = ({
  onRequestNextChapter,
  onRequestPreviousChapter,
  showNavigationButtons,
  isRtlLanguage,
  disablePrevious,
  disableNext
}) => (
  <I18n>
    {({ i18n }) => (
      <>
        <Button
          style={{ left: 0, opacity: showNavigationButtons ? 1 : 0 }}
          onClick={onRequestPreviousChapter}
          type="button"
          disabled={disablePrevious}
          aria-label={isRtlLanguage ? i18n.t`Next` : i18n.t`Previous`}
        >
          <KeyboardArrowLeftIcon style={{ fontSize: 50 }} />
        </Button>
        <Button
          style={{ right: 0, opacity: showNavigationButtons ? 1 : 0 }}
          onClick={onRequestNextChapter}
          type="button"
          disabled={disableNext}
          aria-label={isRtlLanguage ? i18n.t`Previous` : i18n.t`Next`}
        >
          <KeyboardArrowRightIcon style={{ fontSize: 50 }} />
        </Button>
      </>
    )}
  </I18n>
);

const Button = styled.button`
  color: ${colors.base.white};
  position: fixed;
  background-color: rgba(68, 68, 68, 0.1);
  height: 100%;
  width: 70px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  ${media.tablet`
    opacity: 1 !important;
    background: none; 
    
    &:hover, &:focus {
      background: rgba(0,0,0,0.1);
    }
    transition: background 0.3s ease;
    width: 120px;
  `};
`;
