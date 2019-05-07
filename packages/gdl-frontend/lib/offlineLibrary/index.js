// @flow
import OfflineLibrary from './OfflineLibrary';
import localForage from 'localforage';

export const CACHE_NAME = 'gdl-offline';

const serviceworker =
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

const online =
  typeof window !== 'undefined' && typeof navigator.onLine === 'boolean';

const browserAllowedStorage =
  typeof window !== 'undefined' && localForage.supports(localForage.INDEXEDDB);

export const isCookiesEnabled = () => {
  let cookieEnabled = typeof window !== 'undefined' && navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
  }
  return cookieEnabled;
};

/**
 * Singleton that is null unless the client has offline support
 */

const offlineLibrary =
  serviceworker && online && browserAllowedStorage && isCookiesEnabled()
    ? new OfflineLibrary()
    : null;

export default offlineLibrary;
