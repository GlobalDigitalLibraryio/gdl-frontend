// @flow
import * as Sentry from '@sentry/browser';

export function register() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        // $FlowFixMe: Flow's own type definitions aren't complete for SWs
        .register('/service-worker.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(function(registrationError) {
          Sentry.captureException(registrationError);
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function unregister() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // $FlowFixMe: Flow's own type definitions aren't complete for SWs
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
      console.log('SW unregistered');
    });
  }
}
