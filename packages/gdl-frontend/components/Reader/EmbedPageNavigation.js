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
import { injectIntl, defineMessages } from 'react-intl';
import Swipeable from 'react-swipeable';
import styled from '@emotion/styled';

import { colors } from '../../style/theme';
import media from '../../style/media';

type Props = {
  className?: string,
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void,
  disableNext: boolean,
  disablePrevious: boolean,
  isRtlLanguage?: boolean,
  children?: React.Node
};

export default class EmbedPageNavigation extends React.Component<Props> {
  onTap = (event: SyntheticTouchEvent<HTMLElement>) => {
    // If we clicked a button, ignore the tap
    // $FlowFixMe: Not sure why Flow complains here
    if (event.target.type === 'button') {
      return;
    }
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

    /**
     * It is important that Swipable includes the Buttons,
     * so we can start swiping all the way from edge of the screens
     */
    return (
      <Swipeable
        className={className}
        onSwipedLeft={onRequestNextChapter}
        onSwipedRight={onRequestPreviousChapter}
        onTap={this.onTap}
      >
        {this.props.children}
        <NavigationButtons
          onRequestNextChapter={onRequestNextChapter}
          onRequestPreviousChapter={onRequestPreviousChapter}
          disableNext={disableNext}
          disablePrevious={disablePrevious}
          isRtlLanguage={isRtlLanguage}
        />
      </Swipeable>
    );
  }
}

const navigationTranslations = defineMessages({
  next: {
    id: 'Next',
    defaultMessage: 'Next'
  },
  previous: {
    id: 'Previous',
    defaultMessage: 'Previous'
  }
});
/**
 * These buttons should only be visible in embed view
 */
const NavigationButtons = injectIntl(
  ({
    onRequestNextChapter,
    onRequestPreviousChapter,
    isRtlLanguage,
    disablePrevious,
    disableNext,
    intl
  }) => (
    <>
      <Button
        style={{ left: 0 }}
        onClick={onRequestPreviousChapter}
        type="button"
        disabled={disablePrevious}
        aria-label={
          isRtlLanguage
            ? intl.formatMessage(navigationTranslations.next)
            : intl.formatMessage(navigationTranslations.previous)
        }
      >
        <KeyboardArrowLeftIcon style={{ fontSize: 45 }} />
      </Button>
      <Button
        style={{ right: 0 }}
        onClick={onRequestNextChapter}
        type="button"
        disabled={disableNext}
        aria-label={
          isRtlLanguage
            ? intl.formatMessage(navigationTranslations.previous)
            : intl.formatMessage(navigationTranslations.next)
        }
      >
        <KeyboardArrowRightIcon style={{ fontSize: 45 }} />
      </Button>
    </>
  )
);

const Button = styled('button')`
  z-index: 3;
  color: ${colors.text.subtle};
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  background: none;
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
