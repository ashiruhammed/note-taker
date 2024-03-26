/* eslint-disable @typescript-eslint/no-unused-vars */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwM7i0Dc3pZyqfCOaj5e6eMgZLVbKX0FI",
  authDomain: "note-taking-app-f80e0.firebaseapp.com",
  projectId: "note-taking-app-f80e0",
  storageBucket: "note-taking-app-f80e0.appspot.com",
  messagingSenderId: "800820244133",
  appId: "1:800820244133:web:defc7a63ef3bcc5d3ae74c",
  measurementId: "G-4XZDEP8B46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
