"use client";
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Home from './Home/home'
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/ui/navbar';

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar></Navbar>
        <Home></Home>
      </AuthProvider>
    </>
  );
}


export default App;