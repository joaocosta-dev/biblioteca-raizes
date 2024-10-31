/* eslint-disable no-unused-vars */
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

// hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "./hooks/useAuthentication";

// pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";

// components
import Navbar from "./components/NavigationBar";
import Footer from "./components/Footer";
import CreateBook from "./pages/CreateBook/CreateBook";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Dash from "./pages/Dash/Dash";
import EditBook from "./pages/EditBook/EditBook";
import Book from "./pages/Book/Book";

// context
import { AuthProvider } from "./contexts/AuthContext";

//theme
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/themeNavbar';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Navbar />
          </ThemeProvider>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/books/insert"
                element={user ? <CreateBook /> : <Navigate to="/login" />}
              />
              <Route
                path="/books/edit/:id"
                element={user ? <EditBook /> : <Navigate to="/login" />}
              />
              <Route path="/books/:id" element={<Book />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />

            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
