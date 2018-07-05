// @flow
import * as React from 'react';

type Props = {
  content: string
};

export default class ChapterPreview extends React.Component<Props> {
  render() {
    console.log(this.props.content);

    return <div dangerouslySetInnerHTML={{ __html: this.props.content }} />;
  }
}
