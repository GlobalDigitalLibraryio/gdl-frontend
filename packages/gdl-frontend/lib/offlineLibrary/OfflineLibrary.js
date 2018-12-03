// @flow
import { coverImageUrl } from 'gdl-image';
import localForage from 'localforage';
import gql from 'graphql-tag';

import { initApollo } from 'gdl-apollo-client';
import type { OfflineBook, OfflineBook_book as Book } from '../../gqlTypes';
import TimestampModel from './TimestampModel';
import { CACHE_NAME } from './index';

// 7 days
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function openCache() {
  return window.caches.open(CACHE_NAME);
}

export default class OfflineLibrary {
  bookStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'books'
  });

  timestampModel = new TimestampModel();

  _addImagesToCache = async (book: Book) => {
    const imageUrls = getImageUrls(book);
    const cache = await openCache();
    await cache.addAll(imageUrls);
  };

  /**
   * When we clean up images it is important that we use the book data that we alredy have in IndexedDB.
   * This is because if you were to use a book object fetched from the network, it's images could have changed,
   * and then we would be left with stale images
   */
  _deleteImagesFromCache = async (id: string) => {
    const book = await this._getBookWithoutExpiration(id);
    if (!book) return;

    const imageUrls = getImageUrls(book);

    const cache = await openCache();
    for (const request of await cache.keys()) {
      if (imageUrls.includes(request.url)) {
        cache.delete(request);
      }
    }
  };

  /**
   * Expires entries older than the given timestamp
   */
  async _expireEntries(expireOlderThanTimestamp: number) {
    const entries = await this.timestampModel.getTimeStamps();

    const oldEntries = entries.filter(
      entry => entry.timestamp < expireOlderThanTimestamp
    );

    await Promise.all(oldEntries.map(entry => this.deleteBook(entry.id)));
  }

  async _getBookWithoutExpiration(id: string): Promise<?Book> {
    return this.bookStore.getItem(id);
  }

  async getBook(id: string): Promise<?Book> {
    const book = await this._getBookWithoutExpiration(id);
    if (!book) return;

    const timestamp = await this.timestampModel.getTimestamp(id);
    // Unable to make sense of timestamp. Assume we're okay
    if (!timestamp) {
      // But attempt to rectify it by setting one
      this.timestampModel.setTimestamp(id);
      return book;
    }

    // If we have a valid timestamp, then our offlined data is fresh if the
    // timestamp plus maxAgeMs is greater than the current time.
    const now = Date.now();

    const isFresh = timestamp >= now - MAX_AGE_MS;

    if (isFresh) {
      return book;
    }
    this.deleteBook(book.id);
  }

  /**
   * Get all books in the offline library
   *
   */
  async getBooks(): Promise<Array<Book>> {
    await this._expireEntries(Date.now() - MAX_AGE_MS);

    const books = [];

    await this.bookStore.iterate(value => {
      books.push(value);
      return;
    });

    return books;
  }

  /**
   * Clears whole library
   */
  async clear() {
    return Promise.all([
      this.timestampModel.clear(),
      this.bookStore.clear(),
      window.caches.delete(CACHE_NAME)
    ]);
  }

  async deleteBook(id: string) {
    await this._deleteImagesFromCache(id);

    this.timestampModel.deleteTimestamp(id);
    // NB! Must be last, the other methods depends on the book being in in IndexedDB.
    return await this.bookStore.removeItem(id);
  }

  async addBook(id: string) {
    try {
      const client = initApollo();

      const { data }: { data: OfflineBook } = await client.query({
        query: OFFLINE_BOOK_QUERY,
        variables: { id }
      });

      if (!data.book) {
        return false;
      }
      const book = data.book;

      // Add all the images to the cache
      await this._addImagesToCache(book);

      await this.timestampModel.setTimestamp(book.id);
      await this.bookStore.setItem(book.id, book);

      console.log(data);
      return true;
    } catch (error) {
      // If something went wrong when offlining the book, cleanup after ourselves
      this.deleteBook(id);
      console.error(error);
      return false;
    }
  }
}

/**
 * Get all unique image URLs in a book and it's chapters
 */
function getImageUrls(book: Book) {
  let imageUrls = book.chapters.reduce(
    (images, chapter) => images.concat(chapter.imageUrls),
    []
  );
  // Remove duplicates. Some chapters use the same image. The publisher logo, for instance, is often repeated in the chapters
  imageUrls = [...new Set(imageUrls)];

  if (book.coverImage) {
    imageUrls.push(coverImageUrl(book.coverImage));
  }
  return imageUrls;
}

const OFFLINE_BOOK_QUERY = gql`
  query OfflineBook($id: ID!) {
    book(id: $id) {
      id
      bookId
      title
      description
      category
      readingLevel
      bookFormat
      supportsTranslation
      additionalInformation
      chapters {
        id
        seqNo
        chapterId
        content
        imageUrls
      }
      downloads {
        epub
        pdf
      }
      license {
        url
        name
      }
      language {
        code
        name
        isRTL
      }
      coverImage {
        url
        variants {
          height
          width
          x
          y
          ratio
        }
      }
      publisher {
        name
      }
      authors {
        name
      }
      illustrators {
        name
      }
      translators {
        name
      }
      photographers {
        name
      }
    }
  }
`;
