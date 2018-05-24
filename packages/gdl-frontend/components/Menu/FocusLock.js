// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { findDOMNode } from 'react-dom';

type Props = {
  autoFocus?: boolean,
  hasOpenNestedMenu?: boolean,
  isNestedMenu?: boolean,
  children?: Node
};

const getAppContainerElement = () => document.getElementById('__next');

// Return a node list of all elements we can tab to
const tabbable = (el: HTMLElement) =>
  el.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

export default class FocusLock extends React.Component<Props> {
  // Keep the previously active element, so we can restore focus when we unmount
  lastActiveElement: HTMLElement | null;
  boundary: HTMLElement | null = null;

  static defaultProps = {
    autoFocus: false,
    hasOpenNestedMenu: false,
    isNestedMenu: false,
    disabled: false
  };

  componentDidMount() {
    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('keydown', this.handleKeyDown);
    this.lastActiveElement = document && document.activeElement;

    if (!this.props.isNestedMenu) {
      const appContainer = getAppContainerElement();
      appContainer && appContainer.setAttribute('aria-hidden', '');
    }

    const boundary = findDOMNode(this);

    if (boundary instanceof HTMLElement) {
      this.boundary = boundary;
      if (this.props.autoFocus) {
        this.focusFirst();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('keydown', this.handleKeyDown);

    if (!this.props.isNestedMenu) {
      const appContainer = getAppContainerElement();
      appContainer && appContainer.removeAttribute('aria-hidden');
    }

    // Restore focus when we unmount. Do this as a callback to make sure stuff gets unmounted.
    setTimeout(() => {
      if (this.lastActiveElement) {
        this.lastActiveElement.focus();
      }
    }, 0);
  }

  focusFirst() {
    // $FlowFixMe
    const focusable = tabbable(this.boundary);
    focusable[0] && focusable[0].focus();
  }

  handleFocus() {
    this.focusFirst();
  }

  // Loop back to the first tabbable element from the last
  handleKeyDown = (event: KeyboardEvent) => {
    const { key, target, shiftKey } = event;
    if (key !== 'Tab' || this.props.hasOpenNestedMenu) return;

    // $FlowFixMe
    const els = tabbable(this.boundary);
    const last = els[els.length - 1];

    if (target === last && !shiftKey) {
      const first = els[0];
      event.preventDefault();
      first.focus();
    }
  };

  // Catch the focus if the target is outside of locked element
  handleFocusIn = (event: FocusEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLElement) || this.props.hasOpenNestedMenu) {
      return;
    }

    const shouldFocus =
      this.boundary &&
      this.boundary !== target &&
      !this.boundary.contains(target);

    if (shouldFocus) this.handleFocus();
  };

  render() {
    return this.props.children;
  }
}
