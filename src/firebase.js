import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP7saJb5wxBywb-Pq3FC7qZfSsVbugWWY",
  authDomain: "budget-tracker-7944b.firebaseapp.com",
  projectId: "budget-tracker-7944b",
  storageBucket: "budget-tracker-7944b.firebasestorage.app",
  messagingSenderId: "253766870093",
  appId: "1:253766870093:web:da55a633bda7aef9f66804",
  measurementId: "G-HVB21GXC1C"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);