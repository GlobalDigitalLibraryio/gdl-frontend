// @flow

import * as React from 'react';
import GridContainer from '../BookGrid/styledGridContainer';
import BookLink, { type Book } from './BookSelectionLink';

type Props = {
  books: $ReadOnlyArray<Book>,
  selectedBooks: Array<string>,
  changeActive: () => void,
  selectAll: boolean
};

class BookGrid extends React.Component<Props> {
  render() {
    const { books, selectedBooks } = this.props;

    return (
      <GridContainer>
        {books.map(book => (
          <BookLink
            key={book.id}
            book={book}
            selectedBooks={selectedBooks}
            changeActive={this.props.changeActive}
            selectAll={this.props.selectAll}
          />
        ))}
      </GridContainer>
    );
  }
}

export default BookGrid;
