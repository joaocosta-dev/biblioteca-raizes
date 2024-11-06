import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { NavLink } from 'react-router-dom';
import { useAuthValue } from '../contexts/AuthContext';
import logo from '../assets/logo-white.png';
import DropdownButton from './DropdownButton';

export default function ButtonAppBar({ name }) {
  const { user, isAdmin, loading } = useAuthValue(); // Agora temos loading e isAdmin

  if (loading) {
    return <div>Carregando...</div>; // Exibe um estado de carregamento enquanto verifica
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img width="120px" src={logo} alt="logo da empresa"></img>
          </Typography>
          <Button color="inherit">
            <NavLink to="/">Home</NavLink>
          </Button>
          {!user && (
            <>
              <Button color="inherit">
                <NavLink to="/login">Entrar</NavLink>
              </Button>

              <Button color="inherit">
                <NavLink to="/register">Cadastrar</NavLink>
              </Button>
            </>
          )}
          {user && isAdmin && (
            <>
              <Button color="inherit">
                <NavLink to="/books/insert">Inserir Livro</NavLink>
              </Button>

              <Button color="inherit">
                <NavLink to="/dashboard">Solicitações</NavLink>
              </Button>
            </>
          )}
          <Button color="inherit">
            <NavLink to="/about">Sobre</NavLink>
          </Button>
          {user && (
            <>
              <Button color="inherit">
                <NavLink to="/dashboard">Área do leitor</NavLink>
              </Button>
              <DropdownButton name={user.displayName}></DropdownButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
