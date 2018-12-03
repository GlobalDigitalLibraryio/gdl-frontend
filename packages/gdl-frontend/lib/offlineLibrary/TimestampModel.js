// @flow
import localForage from 'localforage';

import { CACHE_NAME } from './index';

/**
 * We keep track of when the book was offlined, so we can expire it after a certain time has passed
 */
export default class TimestampModel {
  timestampStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'timestamp'
  });

  getTimestamp = async (id: string): Promise<?number> =>
    this.timestampStore.getItem(id);

  setTimestamp = async (id: string): Promise<void> =>
    this.timestampStore.setItem(id, Date.now());

  deleteTimestamp = async (id: string) => this.timestampStore.removeItem(id);

  getTimeStamps = async (): Promise<
    Array<{ id: string, timestamp: number }>
  > => {
    const timestamps = [];

    await this.timestampStore.iterate((timestamp: number, id: string) => {
      timestamps.push({ id, timestamp });
    });

    return timestamps;
  };

  clear = (): Promise<void> => this.timestampStore.clear();
}
