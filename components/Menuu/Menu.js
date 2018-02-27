// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node, type Element } from 'react';
import { Portal } from 'react-portal';

import { Dialog, FillScreen, Positioner, bodyCss } from './styled/Dialog';
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
  /** Will display a 'back' button instead of a close button in the header */
  isNestedMenu?: boolean,
  /** Content of the menu */
  children?: Node,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void,
  /** Boolean indicating if pressing the `esc` key should close the modal. */
  shouldCloseOnEscapePress: boolean,
  /** Boolean indicating if clicking the overlay should close the modal. */
  shouldCloseOnOverlayClick: boolean
};

export default class Modal extends React.Component<Props> {
  static defaultProps = {
    autoFocus: true,
    isNestedMenu: false,
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true
  };

  componentDidMount() {
    document.body.classList.add(bodyCss);
  }

  componentWillUnmount() {
    document.body.classList.remove(bodyCss);
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
      isNestedMenu,
      heading,
      onClose,
      shouldCloseOnEscapePress
    } = this.props;
    return (
      <Portal>
        <FillScreen>
          <Backdrop onClick={this.handleOverlayClick} />
          <Positioner>
            <FocusLock autoFocus={autoFocus}>
              <Dialog
                role="dialog"
                tabIndex="-1"
                onClick={this.handleDialogClick}
              >
                <Content
                  isNestedMenu={isNestedMenu}
                  heading={heading}
                  onClose={onClose}
                  shouldCloseOnEscapePress={shouldCloseOnEscapePress}
                >
                  {children}
                </Content>
              </Dialog>
            </FocusLock>
          </Positioner>
        </FillScreen>
      </Portal>
    );
  }
}
