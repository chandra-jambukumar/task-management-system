# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Task Management System.

## Why Google OAuth?

- ✅ **Easier for users** - No need to remember another password
- ✅ **More secure** - Leverages Google's security infrastructure
- ✅ **Faster signup** - One-click registration
- ✅ **Profile pictures** - Automatically imports user avatars

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Task Management System"
4. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Task Management System
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Add `userinfo.email` and `userinfo.profile`
   - Test users: Add your email for testing
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Task Management Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
   - Click "Create"

5. Copy the **Client ID** and **Client Secret**

### 4. Update Backend Environment Variables

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 5. Test the Integration

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Go to `http://localhost:5173/login`
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected back to the app and logged in!

## How It Works

### Backend Flow

1. User clicks "Continue with Google"
2. Browser redirects to `/api/auth/google`
3. Passport redirects to Google's OAuth page
4. User authorizes the app
5. Google redirects back to `/api/auth/google/callback`
6. Backend creates/finds user in database
7. Backend generates JWT token
8. Backend redirects to frontend with token

### Frontend Flow

1. Frontend receives token in URL
2. Stores token and user in localStorage
3. Redirects to boards page
4. User is now authenticated!

## Production Deployment

For production, you'll need to:

1. Add your production domain to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback`

2. Update environment variables:
```env
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CORS_ORIGIN=https://yourdomain.com
```

3. Submit your app for OAuth verification (if needed for public use)

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes
- Verify the protocol (http vs https)

### "Access blocked: This app's request is invalid"

- Make sure you've configured the OAuth consent screen
- Add your email as a test user
- Enable the Google+ API

### User not being created

- Check backend logs for errors
- Verify database is running
- Make sure email is being returned from Google profile

## Security Notes

- Never commit `.env` files with real credentials
- Use different OAuth credentials for development and production
- Regularly rotate your client secret
- Monitor OAuth usage in Google Cloud Console
- Set up proper CORS origins to prevent unauthorized access

## Alternative: Email/Password

Users can still register with email/password if they prefer. Both authentication methods work side-by-side!
