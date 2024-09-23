// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "realtime-chat-7ec2f.firebaseapp.com",
  projectId: "realtime-chat-7ec2f",
  storageBucket: "realtime-chat-7ec2f.appspot.com",
  messagingSenderId: "592770338445",
  appId: "1:592770338445:web:ff75a9bbeccf673e2b5cc4"
};

const app = initializeApp(firebaseConfig);

export const auth =getAuth();
export const db = getFirestore();
export const storage = getStorage();