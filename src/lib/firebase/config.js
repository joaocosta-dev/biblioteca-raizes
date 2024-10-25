
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDnXD4CXVcBbJwsOnSPuNoSg7l8CTprXEw",
  authDomain: "livraria-raizes.firebaseapp.com",
  projectId: "livraria-raizes",
  storageBucket: "livraria-raizes.appspot.com",
  messagingSenderId: "427266841669",
  appId: "1:427266841669:web:23ae2e2120428b4cc2d72c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db};