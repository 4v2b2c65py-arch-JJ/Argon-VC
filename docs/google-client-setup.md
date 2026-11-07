# Google Client Setup (OAuth2)

The Argon backend uses Google OAuth2 for sign-in. No Google client secret or raw
ID token ever reaches the frontend — everything stays server-side.

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com/
2. Create a new project (or select an existing one)
3. Enable the **Google Identity Services** API
4. Go to **Credentials** → **Create credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `Argon Frontend`
7. Authorized redirect URIs:
   - `http://127.0.0.1:8765/auth/google/callback` (local dev)
   - `https://arvc-indol.vercel.app/auth/google/callback` (production)

## 2. Set environment variables (never commit these)

Create a `.env` file (or export in your shell):

```bash
export ARGON_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID.apps.googleusercontent.com"
export ARGON_GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
export ARGON_AUTH_REDIRECT_URI="http://127.0.0.1:8765/auth/google/callback"
export ARGON_CORS_ORIGINS="http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:8080,http://localhost:8080,https://arvc-indol.vercel.app"
```

On Windows (PowerShell):

```powershell
$env:ARGON_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID.apps.googleusercontent.com"
$env:ARGON_GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
$env:ARGON_AUTH_REDIRECT_URI="http://127.0.0.1:8765/auth/google/callback"
```

## 3. Run the backend

```bash
python -m yamal.api.server
```

## 4. Sign in from the frontend

Open the frontend (served by the backend at `http://127.0.0.1:8765`), click
"Sign in with Google", and you'll be redirected through Google's OAuth2 flow.
The backend sets an httpOnly session cookie; the frontend never sees secrets.

## Security notes

- `ARGON_GOOGLE_CLIENT_SECRET` must never be in the repo or frontend.
- Sessions are server-side; browsers hold only an httpOnly cookie.
- Session TTL: 7 days.
- `prompt=consent` ensures users always see the Google consent screen.
