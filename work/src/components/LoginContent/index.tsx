import { useAuth } from "../../Auth/AuthContext";
import DefaultInput from "../Defaultinput";
import styles from "./style.module.css"
import { useNavigate } from 'react-router-dom';
import { showMessage } from "../../messages/showMessage";
import { useState } from 'react';



function LoginContent() {
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email,setEmail] = useState<string>('');
  const [senha,setSenha] = useState<string>('');
  const [emailCor, setCorEmail] = useState<string>('');
  const [senhaCor, setCorSenha] = useState<string>('');
  
  const handleLogin = async (e:React.FormEvent<HTMLFormElement>,) => {
    e.preventDefault()
    
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: senha }),
        credentials: "include", // envia/recebe o cookie httpOnly
      });

      const data = await res.json();

      if (data.message === 'Login successful!') {
        login(data.userId);         
        navigate('/');
        return true;
      }
    
      if(data.message === 'Validation failed'){
        showMessage.error(data.data[0].msg);
      } else {
        showMessage.error(data.message);
      }
     } catch {
    }
  };


  

  
  const emailValidation = (e:React.FormEvent<HTMLInputElement>)=>{
    const email = e.currentTarget.value;
    if(email.length < 5){
      setCorEmail('r')
    }else{
      setCorEmail('b')
    }
  }


  const senhaValidation = (e:React.FormEvent<HTMLInputElement>)=>{
    const senha = e.currentTarget.value;
    if(senha.length < 5){
      setCorSenha('r')
    }else{
      setCorSenha('b')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.label}>Bem-vindo de volta</span>
          <h1 className={styles.title}>
            Fazer <span className={styles.titleAccent}>Login</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className={styles.form} method="post">
          <DefaultInput
            id='email'
            className={emailCor === 'r' ? styles.red : styles.inputs}
            onChangeCapture={e => emailValidation(e)}
            onChange={e => setEmail(e.currentTarget.value)}
            value={email}
            placeholder='Email'
          />
          <DefaultInput
            id='senha'
            type='password'
            className={senhaCor === 'r' ? styles.red : styles.inputs}
            onChangeCapture={e => senhaValidation(e)}
            onChange={e => setSenha(e.currentTarget.value)}
            value={senha}
            placeholder='Senha'
          />
          <button className={styles.botao}>
            Entrar
          </button>
        </form>

        <p className={styles.footer}>
          Não tem conta?
          <a href='/cadastrar' className={styles.footerLink}>Cadastrar</a>
        </p>
      </div>
    </div>
  );
}

export default LoginContent;