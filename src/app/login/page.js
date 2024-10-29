"use client";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";

import Image from 'next/image';

import styles from '../../styles/login.css';
import imageTest from  '../public/login-illustrator.svg';
import emailImage from '../public/email-vector.svg';
import passwordImage from '../public/password-vector.svg';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);

    console.log(res);
  };

  useEffect(() => {
    console.log(authError);
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={"login"}>
      <div className='left-content'>
        <h1>Entrar na sua conta</h1>
        <p>Faça o login para poder utilizar o sistema</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail:</span>
            <div className='input-and-image'>
              <input
                type="email"
                name="email"
                required
                placeholder="E-mail do usuário"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <div className="image-input">
                <Image src={emailImage}/>
              </div>
            </div>
          </label>
          <label>
            <span>Senha:</span>
            <div className='input-and-image'>
              <input
                type="password"
                name="password"
                required
                placeholder="Insira a senha"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div className="image-input">
                <Image src={passwordImage}/>
              </div>
            </div>
          </label>
          {!loading && <button className="btn btn-login">Entrar</button>}
          {loading && (
            <button className="btn" disabled>
              Aguarde...
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className='right-content'>
          <Image width={"100%"} src={imageTest}/>
      </div>
    </div>
  );
};

export default Login;
