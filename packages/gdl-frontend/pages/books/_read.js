// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import gql from 'graphql-tag';
import { Query, withApollo, type ApolloClient } from 'react-apollo';

import type {
  Chapter,
  ReadBook_book as Book,
  ReadBook,
  ReadBook_book_chapters
} from '../../gqlTypes';

import { Router } from '../../routes';
import type { ConfigShape, Context } from '../../types';
import { withErrorPage } from '../../hocs';
import Reader from '../../components/Reader';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

type Props = {
  book: Book,
  chapterId: string,
  client: ApolloClient, // Apollo Client instance
  userHasEditAccess: boolean,
  showCanonicalChapterUrl: boolean
};

class Read extends React.Component<Props, { current: ReadBook_book_chapters }> {
  static async getInitialProps({ query, req, apolloClient }: Context) {
    const { data }: { data: ReadBook } = await apolloClient.query({
      query: BOOK_QUERY,
      variables: { id: `${query.id}-${query.lang}` }
    });

    if (!data.book) {
      return {
        statusCode: 404
      };
    }

    const book = data.book;

    // If no chapter is specified, we get the first one
    let chapterId;
    if (query.chapterId) {
      const chapter = book.chapters.find(
        c => c.chapterId.toString() === query.chapterId
      );
      chapterId = chapter ? chapter.id : book.chapters[0].id;
    } else {
      chapterId = book.chapters[0].id;
    }

    const chapterRes = await apolloClient.query({
      query: CHAPTER_QUERY,
      variables: { id: chapterId }
    });

    if (!chapterRes.data.chapter) {
      return {
        statusCode: 404
      };
    }

    return {
      book,
      chapterId,
      showCachnonical: !query.chapterId
    };
  }

  constructor(props: Props) {
    super(props);
    const { chapterId, book } = props;

    const current = book.chapters.find(c => c.id === chapterId);

    if (!current) {
      throw new Error('Chapter not found in book');
    }

    this.state = {
      current
    };
  }

  componentDidMount() {
    const next = this.getNext();
    next && this.preload(next);
  }

  getNext(offset = 1) {
    const { book } = this.props;
    const indexOfCurrent = book.chapters.indexOf(this.state.current);
    return book.chapters[indexOfCurrent + offset];
  }

  getPrevious() {
    const { book } = this.props;
    const indexOfCurrent = book.chapters.indexOf(this.state.current);
    return book.chapters[indexOfCurrent - 1];
  }

  handleNextChapter = () => {
    const next = this.getNext();
    next && this.changeChapter(next);

    const nexter = this.getNext(2);
    nexter && this.preload(nexter);
  };

  preload = async chapter => {
    const result = await this.props.client.query({
      query: CHAPTER_QUERY,
      variables: { id: chapter.id }
    });

    /**
     * Preload all images
     */
    if (result.data.chapter) {
      result.data.chapter.imageUrls.forEach(url => {
        const image = new Image();
        image.src = url;
      });
    }
  };

  changeChapter = chapter => {
    this.setState({ current: chapter });
    Router.replaceRoute(
      'read',
      {
        id: this.props.book.bookId,
        lang: this.props.book.language.code,
        chapterId: chapter.chapterId
      },
      { shallow: true }
    );
  };

  handlePreviousChapter = () => {
    const prev = this.getPrevious();
    prev && this.changeChapter(prev);
  };

  // Go back to the book details when closing the reader
  handleCloseBook = () =>
    Router.replaceRoute('book', {
      id: this.props.book.bookId,
      lang: this.props.book.language.code
    });

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'read',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapterId: this.state.current.id
      },
      { shallow: true }
    );

  render() {
    const { book, showCanonicalChapterUrl } = this.props;
    const { current } = this.state;
    const next = this.getNext();
    const prev = this.getPrevious();

    return (
      <>
        <Head
          title={`Read: ${book.title} (${current.seqNo}/${
            book.chapters.length
          })`}
          description={book.description}
          image={book.coverImage && book.coverImage.url}
        >
          {showCanonicalChapterUrl && (
            <link
              rel="canonical"
              href={`${canonicalUrl}/${book.language.code}/books/read/${
                book.id
              }/${current.id}`}
            />
          )}
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/read/${book.id}/${prev.id}`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/read/${book.id}/${next.id}`}
            />
          )}
        </Head>

        <Query query={CHAPTER_QUERY} variables={{ id: current.id }}>
          {({ data, loading, error }: { data: Chapter }) => (
            <Reader
              book={book}
              chapterWithContent={data.chapter}
              chapterPointer={current}
              onRequestNextChapter={this.handleNextChapter}
              onRequestPreviousChapter={this.handlePreviousChapter}
              onRequestClose={this.handleCloseBook}
            />
          )}
        </Query>
      </>
    );
  }
}

const BOOK_QUERY = gql`
  query ReadBook($id: ID!) {
    book(id: $id) {
      id
      bookId
      title
      description
      language {
        isRTL
        code
      }
      chapters {
        id
        seqNo
        chapterId
      }
      coverImage {
        url: urlV2
      }
    }
  }
`;

const CHAPTER_QUERY = gql`
  query Chapter($id: ID!) {
    chapter(id: $id) {
      id
      seqNo
      chapterId
      content
      imageUrls: imageUrlsV2
    }
  }
`;

export default withErrorPage(withApollo(Read));
