// @flow
import * as React from 'react';



type Props = {
    content: string
};

export default class ChapterPreview extends React.Component<Props> {
    render() {
        return <div dangerouslySetInnerHTML={{__html: this.props.content}}/>

    }
}