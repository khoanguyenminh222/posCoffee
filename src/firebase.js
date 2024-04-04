import { initializeApp, getApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYNRCFfx1ymRjgCUt0u3IUlrrrDjMxQUU",
  authDomain: "shoesstore-fc02b.firebaseapp.com",
  projectId: "shoesstore-fc02b",
  storageBucket: "shoesstore-fc02b.appspot.com",
  messagingSenderId: "28296741902",
  appId: "1:28296741902:web:e0c8cc21e13cb9817ae85f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };