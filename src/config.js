/**
 * Argon-VC frontend config.
 * Set window.ARGON_BACKEND_URL before loading to point at a local/remote bridge.
 * Default: same-origin (works when served by backend) or production portal API base.
 * NEVER put credentials here. Use ARGON_API_TOKEN via secure backend/session only.
 */
window.ARGON_CONFIG = Object.assign({
  backendUrl: (typeof process !== 'undefined' && process.env && process.env.ARGON_BACKEND_URL) || '',
  vercelPortal: 'https://arvc-indol.vercel.app',
  protocolVersion: '2',
  // When served statically on Vercel, set backendUrl to your tunnel/bridge (e.g. ngrok/cloudflared URL)
  // via a small runtime config injection or query param: ?backend=https://your-tunnel
}, window.ARGON_CONFIG || {});

(function() {
  try {
    var q = new URLSearchParams(location.search);
    var b = q.get('backend');
    if (b) window.ARGON_CONFIG.backendUrl = b.replace(/\/$/, '');
  } catch (e) {}
})();

window.argonApiUrl = function(path) {
  var base = (window.ARGON_CONFIG && window.ARGON_CONFIG.backendUrl) || '';
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
};

window.argonApiHeaders = function(extra) {
  var h = Object.assign({'Content-Type': 'application/json', 'X-Protocol-Version': window.ARGON_CONFIG.protocolVersion || '2'}, extra || {});
  var t = window.ARGON_CONFIG && window.ARGON_CONFIG.apiToken;
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
};
