/* Google Login component for Argon frontend */
(function() {
  'use strict';

  const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual Client ID

  // Initialize Google Identity Services
  function initGoogleLogin() {
    // Load Google Identity Services script if not already loaded
    if (!document.getElementById('google-js')) {
      const script = document.createElement('script');
      script.id = 'google-js';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Expose handler globally so index.html can call it
    window.handleGoogleLogin = function() {
      if (typeof google === 'undefined' || !google.accounts) {
        // Google SDK not loaded yet, wait and retry
        const check = setInterval(() => {
          if (typeof google !== 'undefined' && google.accounts) {
            clearInterval(check);
            renderGoogleButton();
          }
        }, 100);
        return;
      }
      renderGoogleButton();
    };

    // Callback when user signs in
    window.handleCredentialResponse = function(response) {
      // Decode JWT payload to get user info
      const payload = parseJwt(response.credential);
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
      };

      // Update UI
      const avatar = document.getElementById('user-avatar');
      const nameEl = document.getElementById('user-name');
      const emailEl = document.getElementById('user-email');
      const loginBtn = document.getElementById('google-login-btn');
      const menu = document.getElementById('user-menu');

      if (avatar) {
        avatar.style.display = 'flex';
        avatar.textContent = (user.name || user.email).charAt(0).toUpperCase();
        if (user.picture) {
          avatar.style.backgroundImage = `url(${user.picture})`;
          avatar.style.backgroundSize = 'cover';
          avatar.textContent = '';
        }
      }
      if (nameEl) nameEl.textContent = user.name || 'Argon User';
      if (emailEl) emailEl.textContent = user.email;
      if (loginBtn) loginBtn.style.display = 'none';
      if (menu) menu.classList.remove('hidden');

      // Store token for API calls
      localStorage.setItem('argon_google_token', response.credential);
      localStorage.setItem('argon_user', JSON.stringify(user));

      console.log('Google sign-in successful:', user.email);
    };
  }

  function renderGoogleButton() {
    const container = document.getElementById('google-login-btn');
    if (!container) return;

    // Create the Google button element
    const btn = document.createElement('div');
    btn.id = 'google-id-button';
    container.innerHTML = '';
    container.appendChild(btn);

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: window.handleCredentialResponse,
    });

    google.accounts.id.renderButton(btn, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      logo_alignment: 'center',
      text: 'signin_with',
    });

    google.accounts.id.prompt(); // display One Tap
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  }

  // Auto-init when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleLogin);
  } else {
    initGoogleLogin();
  }

})();
