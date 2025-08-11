// Lightweight Google Identity Services (GIS) loader and helpers

let googleScriptLoadingPromise = null;
let initialized = false;
let currentCallback = null;

export function loadGoogleScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.google && window.google.accounts && window.google.accounts.id) {
    return Promise.resolve();
  }
  if (googleScriptLoadingPromise) return googleScriptLoadingPromise;
  googleScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
  });
  return googleScriptLoadingPromise;
}

export function decodeJwt(credential) {
  if (!credential) return null;
  try {
    const payload = credential.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded || null;
  } catch (e) {
    console.warn('JWT decode failed', e);
    return null;
  }
}

export async function promptGoogleId({ clientId, onCredential }) {
  if (!clientId) throw new Error('Missing Google Client ID');
  await loadGoogleScript();
  /* global google */
  // Initialize once globally; route callbacks through currentCallback
  if (!initialized) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential && typeof currentCallback === 'function') {
          currentCallback(response.credential);
        }
      },
      auto_select: false,
      context: 'signin',
    });
    initialized = true;
  }
  currentCallback = onCredential;
  try {
    // Cancel any outstanding prompt to avoid FedCM concurrency error
    if (window.google?.accounts?.id?.cancel) {
      window.google.accounts.id.cancel();
    }
  } catch (_) {}
  // Yield to the event loop to ensure cancel completes
  setTimeout(() => {
    try {
      window.google.accounts.id.prompt();
    } catch (e) {
      console.warn('GIS prompt error', e);
    }
  }, 0);
}

export function cancelGooglePrompt() {
  try { window.google?.accounts?.id?.cancel && window.google.accounts.id.cancel(); } catch (_) {}
}


