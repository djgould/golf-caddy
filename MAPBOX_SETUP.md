# Mapbox Setup for Golf Caddy

## Prerequisites

To use the map features in Golf Caddy, you'll need a Mapbox account and **two different tokens**:

1. **Public Token** (pk.\*) - For use in your app code
2. **Secret Download Token** (sk.\*) - For downloading Mapbox SDKs during build

### 1. Create a Mapbox Account

1. Go to [Mapbox.com](https://www.mapbox.com/)
2. Click "Sign up" and create a free account
3. Verify your email address

### 2. Get Your Tokens

#### Public Token (for app usage):

1. Log in to your [Mapbox account](https://account.mapbox.com/)
2. Navigate to the "Tokens" page
3. You'll see a "Default public token" - copy this (starts with `pk.`)

#### Secret Download Token (for SDK downloads):

1. Still on the "Tokens" page
2. Click "Create a token"
3. Name it "Golf Caddy Download Token"
4. Under "Secret scopes", check the box for `Downloads:Read`
5. Click "Create token"
6. Copy the token immediately (starts with `sk.`) - you won't be able to see it again!

### 3. Configure the Tokens

#### For the Public Token:

Add to the `.env` file in `apps/mobile/`:

```bash
# In apps/mobile/.env
EXPO_PUBLIC_MAPBOX_TOKEN="pk.your_public_token_here"
```

#### For the Secret Download Token:

**iOS Setup (required for pod install):** Create or update `~/.netrc` file:

```bash
# Create the .netrc file in your home directory
echo "machine api.mapbox.com
  login mapbox
  password sk.your_secret_download_token_here" > ~/.netrc

# Set proper permissions
chmod 600 ~/.netrc
```

**Android Setup:** Create or update `~/.gradle/gradle.properties`:

```bash
# Create gradle properties if it doesn't exist
mkdir -p ~/.gradle
echo "MAPBOX_DOWNLOADS_TOKEN=sk.your_secret_download_token_here" >> ~/.gradle/gradle.properties
```

### 4. Update app.json Configuration

The download token needs to be available during prebuild. Update `apps/mobile/app.json`:

```json
"plugins": [
  "expo-router",
  [
    "@rnmapbox/maps",
    {
      "RNMapboxMapsDownloadToken": "sk.your_secret_download_token_here"
    }
  ]
]
```

**Note:** The download token will be exposed in your generated native files. Never commit these
files to public repositories!

### 5. Building the App

After configuring everything:

```bash
cd apps/mobile

# Clean previous build artifacts
rm -rf ios android

# Prebuild with clean state
npx expo prebuild --clean

# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

## Important Security Notes

- **Never commit** your `.env` file or any file containing tokens
- The download token will appear in generated `Podfile` and `gradle.properties` - add these to
  `.gitignore` if not already
- For production apps, use CI/CD environment variables instead of hardcoding tokens

## Troubleshooting

### iOS Pod Install Fails

- Verify your `~/.netrc` file exists and has correct permissions (600)
- Make sure the download token has `Downloads:Read` scope
- Try running `pod install` directly: `cd ios && pod install`

### Android Build Fails

- Check `~/.gradle/gradle.properties` exists with the token
- Verify the token in `android/gradle.properties` after prebuild

### Token Not Found Errors

- Ensure you're using the correct token type (public vs secret)
- The public token (pk.\*) goes in `.env` and is used in your code
- The secret token (sk.\*) is only for downloading SDKs during build

## Environment Variable Reference

| Variable                    | Where Used                    | Token Type     | Example     |
| --------------------------- | ----------------------------- | -------------- | ----------- |
| `EXPO_PUBLIC_MAPBOX_TOKEN`  | `.env` file, app code         | Public (pk.\*) | pk.eyJ1I... |
| `RNMapboxMapsDownloadToken` | `app.json` plugin config      | Secret (sk.\*) | sk.eyJ1I... |
| `MAPBOX_DOWNLOADS_TOKEN`    | `~/.gradle/gradle.properties` | Secret (sk.\*) | sk.eyJ1I... |
| `.netrc` password           | `~/.netrc` file               | Secret (sk.\*) | sk.eyJ1I... |

## Features Enabled

With Mapbox configured, you'll have access to:

- Satellite imagery of golf courses
- Real-time GPS location tracking
- Distance measurements
- Offline map downloads (coming soon)
- Course boundary overlays
- Hole-by-hole navigation

## Usage Limits

The free tier includes:

- 50,000 map loads per month
- 50,000 direction requests
- 50,000 geocoding requests

This is more than enough for development and moderate production use.
