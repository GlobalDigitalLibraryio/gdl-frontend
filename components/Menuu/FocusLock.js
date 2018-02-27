// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import tabbable from 'tabbable';
import { findDOMNode } from 'react-dom';

type Props = {
  autoFocus?: boolean,
  children?: Node
};

const getAppContainerElement = () => document.getElementById('__next');

export default class FocusLock extends React.Component<Props> {
  lastActiveElement: HTMLElement | null;
  boundary: HTMLElement | null = null;

  static defaultProps = {
    autoFocus: false
  };

  componentDidMount() {
    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('keydown', this.handleKeyDown);
    this.lastActiveElement = document && document.activeElement;

    const appContainer = getAppContainerElement();
    appContainer && appContainer.setAttribute('aria-hidden', '');

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

    const appContainer = getAppContainerElement();
    appContainer && appContainer.removeAttribute('aria-hidden');

    // Restore focus when we unmount. Do this as a callback to make sure stuff gets unmounted.
    setTimeout(() => {
      if (this.lastActiveElement) {
        this.lastActiveElement.focus();
      }
    }, 0);
  }

  focusFirst() {
    // Don't do the tiresome nested looping: https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
    const focusable = tabbable(this.boundary);
    focusable[0] && focusable[0].focus();
  }

  handleFocus() {
    this.focusFirst();
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { key, target, shiftKey } = event;
    if (key !== 'Tab') return;

    const els = tabbable(this.boundary);
    const first = els[0];
    const last = els[els.length - 1];

    if (target === last && !shiftKey) {
      event.preventDefault();
      first.focus();
    }
  };

  // Catch the focus if the target is outside of locked element
  handleFocusIn = (event: FocusEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;

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
