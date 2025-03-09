// This is the entry point for Firebase configuration
// Platform-specific files will be automatically selected:
// - firebase.web.ts for web
// - firebase.native.ts for native
import { Platform } from 'react-native';

const config = Platform.select({
  web: () => require('./firebase.web'),
  default: () => require('./firebase.native'),
});

export const { auth, firestore } = config(); 