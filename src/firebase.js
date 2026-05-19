// Import
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAu77BXNSytET_XbTOdJ2SJ2A7SmFazCaU",
  authDomain: "skillage-edupark.firebaseapp.com",
  databaseURL:
    "https://skillage-edupark-default-rtdb.firebaseio.com",
  projectId: "skillage-edupark",
  storageBucket:
    "skillage-edupark.firebasestorage.app",
  messagingSenderId: "778936930639",
  appId:
    "1:778936930639:web:4977f0ee5294cc7510753a",
  measurementId: "G-T8YWRZ838N",
};

// Init Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Init Realtime Database
const db = getDatabase(app);

// Export
export { db };
export default app;