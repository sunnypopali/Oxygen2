import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIX6PGUs2MD_E5bxts9kvp2DfAY8P394w",
  authDomain: "o2gymtrack.firebaseapp.com",
  projectId: "o2gymtrack",
  storageBucket: "o2gymtrack.firebasestorage.app",
  messagingSenderId: "630240900417",
  appId: "1:630240900417:web:5ece118131bc61b3ae9dc0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };