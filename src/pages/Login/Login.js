import styles from "./Login.css";

import { useEffect, useState } from "react";

import { useAuthentication } from "../../hooks/useAuthentication";
import emailVector from '../../assets/email-vector.svg';
import passwordImage from '../../assets/password-vector.svg';
import mainImage from '../../assets/login-illustrator.svg';
import logo from "../../assets/logo-white.png";

import Button from '@mui/material/Button';

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
    <div className="login login-page flex bg-white">
      <div className='left-content'>
        <div className="logo-container">
          <img width="120px" src={logo} alt="logo da empresa"></img>
        </div>
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
                <img src={emailVector}/>
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
                <img src={passwordImage}/>
              </div>
            </div>
          </label>
          {!loading && <button className="btn btn-login mb-2">Entrar</button>}
          {loading && (
            <button className="btn" disabled>
              Aguarde...
            </button>
          )}
          {error && <p className="error">{error}</p>}
          <Button href="/register">Não tem uma conta ainda?</Button>
        </form>
      </div>
      <div className='right-content'>
          <img width={"100%"} src={mainImage}/>
      </div>
    </div>
  );
};

export default Login;
