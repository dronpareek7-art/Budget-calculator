import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBILWTAOMCvlyWZBxORSUiM7lcu4bvSfpA",
  authDomain: "budget-tracker-c4783.firebaseapp.com",
  projectId: "budget-tracker-c4783",
  storageBucket: "budget-tracker-c4783.firebasestorage.app",
  messagingSenderId: "351334671667",
  appId: "1:351334671667:web:f1de4539592440878c0a46"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);