// serviceWorkerRegistration.js

// This code registers the service worker

export function register() {
    if ('serviceWorker' in navigator) {
      // Make sure the service worker is registered after the page loads
      window.addEventListener('load', () => {
        const swUrl = '/service-worker.js';
  
        // Try to register the service worker
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }
  