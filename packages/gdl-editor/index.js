// @flow
import React from 'react';
import { Value } from 'slate';
import Html from 'slate-html-serializer';
import SoftBreak from 'slate-soft-break';
import { Editor } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import rules, { schema } from './schema';

const serializer = new Html({ rules });

const plugins = [
  /* A soft break is a new line like <br />. Use shift + enter for this */
  new SoftBreak({ shift: true })
];

/**
 * Define hotkey matchers.
 */
const isBoldHotKey = isKeyHotkey('mod+b');
const isItalicHotKey = isKeyHotkey('mod+i');

export default class BookEditor extends React.Component {
  state = {
    value: serializer.deserialize('<p></p>')
  };

  componentDidUpdate(prevProps) {
    if (prevProps.html !== this.props.html) {
      this.setState({ value: serializer.deserialize(this.props.html) });
    }
  }

  /**
   * On change, save the new `value`.
   */
  handleChange = ({ value }) => this.setState({ value });

  /**
   * On key down, if it's a formatting command toggle a mark.
   */
  handleKeyDown = (event, change) => {
    let mark;
    if (isBoldHotKey(event)) {
      mark = 'bold';
    } else if (isItalicHotKey(event)) {
      mark = 'italic';
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  render() {
    return (
      <Editor
        autoFocus
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.value}
        renderNode={renderNode}
        renderMark={renderMark}
        schema={schema}
        plugins={plugins}
      />
    );
  }
}

/**
 * Render a Slate node
 */
const renderNode = props => {
  const { attributes, children, node, isFocused } = props;
  switch (node.type) {
    case 'paragraph':
      return <p>{children}</p>;
    case 'image':
      const src = node.data.get('src');
      const alt = node.data.get('alt');
      return (
        <>
          <img
            src={src}
            alt={alt}
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
          <small
            style={{ fontStyle: 'italic', color: isFocused ? 'black' : 'gray' }}
          >
            Alt: {alt}
          </small>
        </>
      );
    case 'a':
      const href = node.data.get('href');
      return <a href={href}>{children}</a>;
    default:
      return null;
  }
};

/**
 * Render a Slate mark
 */
const renderMark = props => {
  const { attributes, children, mark } = props;
  switch (mark.type) {
    case 'bold':
      return <strong>{children}</strong>;
    case 'italic':
      return <em>{children}</em>;
    default:
      return null;
  }
};
