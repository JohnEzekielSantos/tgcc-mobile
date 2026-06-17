# TGCC Line-up — Mobile App

## Quick Start

1. Install **Node.js** → https://nodejs.org
2. Install **Expo Go** on your phone (App Store / Google Play)
3. Open this folder in VS Code → install recommended extensions
4. In terminal:
   ```
   npm install
   npx expo install expo-asset expo-image-picker
   npx expo start
   ```
5. Scan QR code with Expo Go on your phone

## Features
- 📋 Sunday service line-up builder
- 🎼 Song library with search & category filter  
- 🎵 Song structure editor (Intro, Verse I/II, Chorus, Bridge, Outro…)
- 🖼 Profile photo upload (camera or gallery)
- 🔐 Role-based access (Admin / Editor / Viewer / Pending)
- ⚙️ Admin panel: approve songs, manage users, view stats
- 👥 Ministry Team panel (Musicians, Vocals, Technical)
- 💾 Offline-first with AsyncStorage

## Roles
| Role    | Can do |
|---------|--------|
| Admin   | Everything |
| Editor  | Add/edit songs, manage lineup |
| Viewer  | View lineup & library, choose songs |
| Pending | Waiting for admin approval |

First person to sign in becomes Admin automatically.
