// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import {getFirestore} from "@firebase/firestore";
import { useEffect, useState } from 'react';
import { getStorage } from 'firebase/storage';
//import { auth } from './firebase'; // Import the Firebase auth instance

const firebaseConfig = {
  apiKey: "AIzaSyDPS4pNQVsyRTkjSq64umSow_ubm5J_nHI",
  authDomain: "mangoapp-1f4dc.firebaseapp.com",
  projectId: "mangoapp-1f4dc",
  storageBucket: "mangoapp-1f4dc.appspot.com",
  messagingSenderId: "517256636471",
  appId: "1:517256636471:web:1f06047dd3d61428a2b7b2",
  measurementId: "G-E9HXVK7DD9"
};

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return user;
}




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };