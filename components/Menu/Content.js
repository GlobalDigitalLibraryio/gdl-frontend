// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node, type Element } from 'react';

import Header from './Header';
import KeyDown from '../KeyDown';
import { Wrapper, Body } from './styled/Content';

type Props = {
  /** The menu title; rendered in the header. */
  heading: string | Element<'Trans'>,
  /** Will display a 'back' button instead of a close button in the header */
  isNestedMenu?: boolean,
  /** For accessibility reasons */
  hasOpenNestedMenu?: boolean,
  /** Content of the menu */
  children?: Node,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: (
    event: | SyntheticMouseEvent<any>
    | SyntheticKeyboardEvent<any>
    | KeyboardEvent
  ) => void,
  /**
    Boolean indicating if pressing the `esc` key should close the modal.
  */
  shouldCloseOnEscapePress: boolean
};

export default class Content extends React.Component<Props> {
  render() {
    const {
      children,
      isNestedMenu,
      hasOpenNestedMenu,
      heading,
      onClose,
      shouldCloseOnEscapePress
    } = this.props;
    return (
      <Wrapper>
        {shouldCloseOnEscapePress && (
          <KeyDown
            disabled={hasOpenNestedMenu}
            when="Escape"
            then={event => onClose(event)}
          />
        )}
        <Header
          heading={heading}
          isNestedMenu={isNestedMenu}
          onClose={onClose}
        />
        <Body>{children}</Body>
      </Wrapper>
    );
  }
}
