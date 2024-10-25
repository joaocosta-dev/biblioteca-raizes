import { useContext, createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config"; // Importe auth e db corretamente

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Novo estado para isAdmin
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Define carregamento como true enquanto verifica
      if (user) {
        setUser(user);

        // Busca a flag isAdmin do Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin || false); // Define isAdmin como true ou false
        }
      } else {
        setUser(null);
        setIsAdmin(false); // Reseta isAdmin quando deslogado
      }
      setLoading(false); // Desativa o carregamento após a verificação
    });

    return () => unsubscribe();
  }, []);

  const value = { user, isAdmin, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthValue() {
  return useContext(AuthContext);
}