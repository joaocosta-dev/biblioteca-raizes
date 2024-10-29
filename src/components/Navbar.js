import { NavLink } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../contexts/AuthContext";
import styles from "./Navbar.module.css";
import logo from "../assets/logo-white.png"


const Navbar = () => {
  const { logout } = useAuthentication();
  const { user, isAdmin, loading } = useAuthValue(); // Agora temos loading e isAdmin

  if (loading) {
    return <div>Carregando...</div>; // Exibe um estado de carregamento enquanto verifica
  }

  return (
    <nav className={styles.navbar}>
      <NavLink className={styles.brand} to="/">
        <img width="200px" src={logo}></img>
      </NavLink>
      <ul className={styles.links_list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Home
          </NavLink>
        </li>

        {!user && (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Cadastrar
              </NavLink>
            </li>
          </>
        )}

        {user && isAdmin && ( // Mostra itens de admin somente se o usuário for admin
          <>
            <li>
              <NavLink
                to="/books/insert"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Inserir Livro
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Dashboard
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Sobre
          </NavLink>
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
