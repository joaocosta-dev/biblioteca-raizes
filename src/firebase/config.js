import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Importando o Firebase Storage

const firebaseConfig = {
  apiKey: 'AIzaSyDnXD4CXVcBbJwsOnSPuNoSg7l8CTprXEw',
  authDomain: 'livraria-raizes.firebaseapp.com',
  projectId: 'livraria-raizes',
  storageBucket: 'livraria-raizes.appspot.com',
  messagingSenderId: '427266841669',
  appId: '1:427266841669:web:23ae2e2120428b4cc2d72c',
};

const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication, Firestore e Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializando o Storage

// Exportando os serviços
export { auth, db, storage }; // Agora exportamos o 'storage' também
