// @flow
import localForage from 'localforage';

import { CACHE_NAME, keyForBook } from './index';

/**
 * We keep track of when the book was offlined, so we can expire it after a certain time has passed
 */
export default class TimestampModel {
  timestampStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'timestamp'
  });

  getTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.getItem(keyForBook(id, language));

  setTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.setItem(keyForBook(id, language), Date.now());

  deleteTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.removeItem(keyForBook(id, language));

  getTimeStamps = async () => {
    const timestamps = [];

    await this.timestampStore.iterate(
      (timestamp: number, compositeId: string) => {
        // Extract the id and language code from the composite id
        const [id, language] = compositeId.split(/-(.+)/);
        timestamps.push({ id, timestamp, language });
      }
    );

    return timestamps;
  };

  clear = () => this.timestampStore.clear();
}
