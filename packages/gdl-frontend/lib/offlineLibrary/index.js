// @flow
import OfflineLibrary from './OfflineLibrary';
import localForage from 'localforage';

export const CACHE_NAME = 'gdl-offline';

const serviceworker =
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

const online =
  typeof window !== 'undefined' && typeof navigator.onLine === 'boolean';

const browserAllowedStorage = localForage.supports(localForage.INDEXEDDB);

/**
 * Singleton that is null unless the client has offline support
 */

const offlineLibrary =
  serviceworker && online && browserAllowedStorage
    ? new OfflineLibrary()
    : null;

export default offlineLibrary;
