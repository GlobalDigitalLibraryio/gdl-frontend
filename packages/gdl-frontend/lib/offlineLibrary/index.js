// @flow
import getConfig from 'next/config';
import type { BookDetails, ConfigShape } from '../../types';
import OfflineLibrary from './OfflineLibrary';

const {
  publicRuntimeConfig: { ENABLE_OFFLINE }
}: ConfigShape = getConfig();

export const CACHE_NAME = 'gdl-offline';

/**
 * Book ids aren't unique. So we make a composite key together with the language
 */
export function keyForBook(
  bookOrId: string | number | BookDetails,
  language?: string
) {
  return arguments.length > 1
    ? // $FlowFixMe
      `${bookOrId}-${language}`
    : // $FlowFixMe
      `${bookOrId.id}-${bookOrId.language.code}`;
}

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
