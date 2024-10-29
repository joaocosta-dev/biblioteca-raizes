"use client";
import { useRouter } from 'next/navigation';

import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";

import styles from '../../styles/register.css';

import Image from 'next/image';
import imageTest from  '../public/login-illustrator.svg';


const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      displayName,
      email,
      password,
      isAdmin,
    };

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    const res = await createUser(user);

    if(res && !authError) {
      router.push('/')
    } else {
      setError(authError || "Ocorreu um erro no cadastro");
    }

    console.log(res);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="flex h-screen">
      <div className="left-content mx-auto my-auto w-full h-full flex justify-center">
        <Image width={"100%"} src={imageTest}/>
      </div>
      <div className="right-content my-auto w-full max-w-[450px] text-center">
        <h1 className="text-black text-xl font-bold">Cadastre-se para postar</h1>
        <p className="text-black text-lg font-medium mb-5">Crie seu usuário e compartilhe suas histórias</p>
        <form onSubmit={handleSubmit} className="flex flex-col mx-5">
          <label className="flex flex-col items-start">
            <span>Nome:</span>
            <input
              type="text"
              name="displayName"
              required
              placeholder="Nome do usuário"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
          </label>
          <label className="flex flex-col items-start">
            <span>E-mail:</span>
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail do usuário"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label className="flex flex-col items-start">
            <span>Senha:</span>
            <input
              type="password"
              name="password"
              required
              placeholder="Insira a senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          <label className="flex flex-col items-start">
            <span>Confirmação de senha:</span>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirme a senha"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </label>
          <label className="flex items-center gap-3">
            <span>Administrador:</span>
            <input
              type="checkbox"
              name="isAdmin"
              onChange={(e) => setIsAdmin(e.target.checked)}
              checked={isAdmin}
              className="max-w-[20px] input-checkbox"
            />
          </label>

          {!loading && <button className="btn btn-register">Cadastrar</button>}
          {loading && (
            <button className="btn" disabled>
              Aguarde...
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      </div>      
    </div>
  );
};

export default Register;
