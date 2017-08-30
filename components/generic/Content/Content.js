import styled from 'styled-components';

/**
 * A single component to handle WYSIWYG generated content, where only HTML tags are available
 * Use this when you just want to directly use HTML tags.
 */

export default styled.div`
  color: #4a4a4a;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  p:not(:last-child),
  ol:not(:last-child),
  ul:not(:last-child) {
    margin-bottom: 1em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #363636;
    font-weight: 400;
    line-height: 1.125;
  }

  h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
    &:not(:first-child) {
      margin-top: 1em;
    }
  }

  h2 {
    font-size: 1.75em;
    margin-bottom: 0.5714em;
    &:not(:first-child) {
      margin-top: 1.1428em;
    }
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 0.6666em;
    &:not(:first-child) {
      margin-top: 1.3333em;
    }
  }

  h4 {
    font-size: 1.25em;
    margin-bottom: 0.8em;
  }

  h5 {
    font-size: 1.125em;
    margin-bottom: 0.8888em;
  }

  h6 {
    font-size: 1em;
    margin-bottom: 1em;
  }

  li + li {
    margin-top: 0.25em;
  }

  ol {
    list-style: decimal outside;
    margin-left: 2em;
    margin-right: 2em;
    margin-top: 1em;
  }

  ul {
    list-style: disc outside;
    margin-left: 2em;
    margin-right: 2em;
    margin-top: 1em;
  }

  ul ul {
    list-style-type: circle;
    margin-top: 0.5em;
  }

  ul ul ul {
    list-style-type: square;
  }
`;
