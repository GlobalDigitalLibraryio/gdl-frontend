// @flow

import * as React from 'react';
import GridContainer from '../BookGrid/styledGridContainer';
import BookLink, { type Book } from './BookSelectionLink';

type Selected = 'all' | 'none' | 'some';

type Props = {
  books: $ReadOnlyArray<Book>,
  selectedBooks: Array<string>,
  selected: Selected,
  changeActive: () => void
};

class BookGrid extends React.Component<Props> {
  render() {
    const { books, selectedBooks, selected } = this.props;

    return (
      <GridContainer>
        {books.map(book => (
          <BookLink
            key={book.id}
            book={book}
            booksLength={books.length}
            selectedBooks={selectedBooks}
            selected={selected}
            changeActive={this.props.changeActive}
          />
        ))}
      </GridContainer>
    );
  }
}

export default BookGrid;
