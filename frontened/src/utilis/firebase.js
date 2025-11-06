
import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGESENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider= new GoogleAuthProvider()
 export async function googleAuth() {
     try {
         let data=await signInWithPopup(auth,provider)
         return data
     } catch (error) {
        console.log(error);
        
     }
}