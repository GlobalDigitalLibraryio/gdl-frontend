// @flow
import OfflineLibrary from './OfflineLibrary';

export const CACHE_NAME = 'gdl-offline';

const serviceworker =
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

const online =
  typeof window !== 'undefined' && typeof navigator.onLine === 'boolean';

/**
 * Singleton that is null unless the client has offline support
 */

const offlineLibrary = serviceworker && online ? new OfflineLibrary() : null;
export default offlineLibrary;
