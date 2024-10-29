import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../contexts/AuthContext";
import { useRouter } from "next/navigation"

import Image from 'next/image';
import logo from '../app/public/logo-white.png';

import styles from "../styles/navbar.css"

const Navbar = () => {
  const { logout } = useAuthentication();
  const { user, isAdmin, loading } = useAuthValue(); // Agora temos loading e isAdmin
  const router = useRouter();

  function navigateTo(param) {
    router.push(param)
  }
  if (loading) {
    return <div>Carregando...</div>; // Exibe um estado de carregamento enquanto verifica
  }

  return (
    <nav className="navbar">
      <button onClick={() => navigateTo("/")}>
        <Image width={200} src={logo} alt="Logo" />
      </button>
      <ul className="links-list">
        <li>
          <button
            onClick={() => navigateTo("/")}
            className={router.pathname === "" ? "active" : ""}>
            Home
            
          </button>
        </li>

        {!user && (
          <>
            <li>
              <button
                onClick={() => navigateTo("/login")}
                className={router.pathname === "/login" ? "active" : ""}
              >
                Entrar
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo("/register")}
                className={router.pathname === "/register" ? "active" : ""}
              >
                Cadastrar
              </button>
            </li>
          </>
        )}

        {user && isAdmin && (
          <>
            <li>
              <button
                onClick={() => navigateTo("/books/insert")}
                className={router.pathname === "/books/insert" ? "active" : ""}
              >
                Inserir Livro
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo("/dashboard")}
                className={router.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </button>
            </li>
          </>
        )}

        <li>
          <button
            onClick={() => navigateTo("/about")}
            className={router.pathname === "/about" ? "active" : ""}
          >
            Sobre
          </button>
        </li>

        {user && (
          <li>
            <button onClick={logout}>Sair</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
