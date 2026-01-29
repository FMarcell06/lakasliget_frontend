import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)

export const db=getFirestore(app)