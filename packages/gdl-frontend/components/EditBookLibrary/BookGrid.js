// @flow

import * as React from 'react';
import GridContainer from '../BookGrid/styledGridContainer';
import BookLink, { type Book } from './BookSelectionLink';

type Props = {
  books: $ReadOnlyArray<Book>,
  selectedBooks: Array<string>,
  active: number,
  changeActive: () => void
};

class BookGrid extends React.Component<Props> {
  render() {
    const { books, selectedBooks, active } = this.props;

    return (
      <GridContainer>
        {books.map(book => (
          <BookLink
            key={book.id}
            book={book}
            selectedBooks={selectedBooks}
            allActive={active}
            changeActive={this.props.changeActive}
          />
        ))}
      </GridContainer>
    );
  }
}

export default BookGrid;
