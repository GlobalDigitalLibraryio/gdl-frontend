// @flow
import getConfig from 'next/config';
import type { ConfigShape } from '../../types';
import OfflineLibrary from './OfflineLibrary';

const {
  publicRuntimeConfig: { ENABLE_OFFLINE }
}: ConfigShape = getConfig();

export const CACHE_NAME = 'gdl-offline';

const serviceworker =
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

const online =
  typeof window !== 'undefined' && typeof navigator.onLine === 'boolean';

/**
 * Singleton that is null unless the client has offline support
 */

const offlineLibrary =
  ENABLE_OFFLINE && serviceworker && online ? new OfflineLibrary() : null;
export default offlineLibrary;
