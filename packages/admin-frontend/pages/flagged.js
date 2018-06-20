import * as React from 'react';
import { fetchFlaggedBooks } from '../lib/fetch';
import type { Book } from '../types';

type LoadingState = 'LOADING' | 'SUCCESS' | 'ERROR';

type State = {
  flaggedBooks: Array<Book>,
  loadingState: LoadingState
};

class Flagged extends React.Component<Props, State> {
  state = {
    flaggedBooks: [],
    loadingState: 'LOADING'
  };

  async componentDidMount() {
    const flaggedBooksRes = await fetchFlaggedBooks();
    if (!flaggedBooksRes.isOk) {
      this.setState({ loadingState: 'ERROR' });
    } else {
      this.setState({
        loadingState: 'SUCCESS',
        flaggedBooks: flaggedBooksRes.data.results
      });
    }
  }

  renderFlaggedBooks = () => {
    if (this.state.flaggedBooks.lenght === 0) {
      return <div>There are no flagged books.</div>;
    }
    return (
      <ul>
        {this.state.flaggedBooks.map(book => (
          <li key={book.id}>
            {book.title} in {book.language.name}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { flaggedBooks, loadingState } = this.state;
    console.log(flaggedBooks);
    return (
      <div>
        {loadingState === 'LOADING' && <div>Getting flagged books... </div>}
        {loadingState === 'SUCCESS' && this.renderFlaggedBooks()}
      </div>
    );
  }
}

export default Flagged;
