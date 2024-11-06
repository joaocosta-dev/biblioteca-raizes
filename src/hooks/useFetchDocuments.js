import { useState, useEffect } from 'react';
import { db } from '../firebase/config'; // Atualize o caminho se necessário
import { collection, onSnapshot } from 'firebase/firestore';

export const useFetchDocuments = (collectionName) => {
  const [documents, setDocuments] = useState([]); // Inicialize como array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching documents: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { documents, loading };
};
