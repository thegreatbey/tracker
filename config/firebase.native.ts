import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase will use google-services.json for configuration
// We don't need to manually initialize with config

export { auth, firestore }; 