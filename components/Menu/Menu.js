// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node, type Element } from 'react';
import { Portal } from 'react-portal';

import {
  CenteredDialog,
  Dialog,
  FillScreen,
  CenteredPositioner,
  Positioner,
  bodyCss,
  htmlCss
} from './styled/Dialog';
import FocusLock from './FocusLock';
import Content from './Content';
import Backdrop from './Backdrop';

type Props = {
  /**
    TRUE will automatically find the first "tabbable" element within the menu.
  */
  autoFocus?: boolean,
  /** The menu title; rendered in the header. */
  heading: string | Element<'Trans'>,
  hasNestedMenu?: boolean,
  /** Center the dialog */
  isCentered?: boolean,
  /** Will display a 'back' button instead of a close button in the header */
  isNestedMenu?: boolean,
  /** For accessibility reasons */
  hasOpenNestedMenu?: boolean,
  /** Content of the menu */
  children?: Node,
  /** Display shaded overlay above the content behind the dialog */
  hasTintedBackground?: boolean,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: (
    event: | SyntheticMouseEvent<any>
    | SyntheticKeyboardEvent<any>
    | KeyboardEvent
  ) => void,
  /** Boolean indicating if pressing the `esc` key should close the modal. */
  shouldCloseOnEscapePress: boolean,
  /** Boolean indicating if clicking the overlay should close the modal. */
  shouldCloseOnOverlayClick: boolean
};

export default class Menu extends React.Component<Props> {
  static defaultProps = {
    autoFocus: true,
    isNestedMenu: false,
    hasOpenNestedMenu: false,
    hasTintedBackground: false,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true
  };

  componentDidMount() {
    if (!this.props.isNestedMenu) {
      // The condition satifies Flow
      document.body && document.body.classList.add(bodyCss);
      document.documentElement &&
        document.documentElement.classList.add(htmlCss);
    }
  }

  componentWillUnmount() {
    if (!this.props.isNestedMenu) {
      // The condition satifies Flow
      document.body && document.body.classList.remove(bodyCss);
      document.documentElement &&
        document.documentElement.classList.remove(htmlCss);
    }
  }

  handleDialogClick = (event: Event) => event.stopPropagation();

  handleOverlayClick = (event: SyntheticMouseEvent<any>) => {
    if (this.props.shouldCloseOnOverlayClick) {
      this.props.onClose(event);
    }
  };

  render() {
    const {
      autoFocus,
      children,
      isCentered,
      isNestedMenu,
      hasOpenNestedMenu,
      hasTintedBackground,
      heading,
      onClose,
      shouldCloseOnEscapePress
    } = this.props;

    const PositionerType = isCentered ? CenteredPositioner : Positioner;
    const DialogType = isCentered ? CenteredDialog : Dialog;
    return (
      <Portal>
        <FillScreen aria-hidden={hasOpenNestedMenu}>
          <Backdrop
            isTinted={hasTintedBackground}
            onClick={this.handleOverlayClick}
          />
          <PositionerType>
            <FocusLock
              autoFocus={autoFocus}
              isNestedMenu={isNestedMenu}
              hasOpenNestedMenu={hasOpenNestedMenu}
            >
              <DialogType
                role="dialog"
                tabIndex="-1"
                onClick={this.handleDialogClick}
              >
                <Content
                  hasOpenNestedMenu={hasOpenNestedMenu}
                  isNestedMenu={isNestedMenu}
                  heading={heading}
                  onClose={onClose}
                  shouldCloseOnEscapePress={shouldCloseOnEscapePress}
                >
                  {children}
                </Content>
              </DialogType>
            </FocusLock>
          </PositionerType>
        </FillScreen>
      </Portal>
    );
  }
}
