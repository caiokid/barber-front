import { useState } from 'react';
import styles from './style.module.css'
import DefaultInput from '../../components/Defaultinput';
import { showMessage } from '../../messages/showMessage';
import { useNavigate } from 'react-router-dom';



function SignupContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
    const navigate = useNavigate();

  
  const handleTeste = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, name,password}),
        credentials: "include"
      })
    
     const data = await res.json()
     
     
     if(data.message === 'Usuário criado!'){
        showMessage.success('Usuário criado!')
        setTimeout(() => {
          navigate('/login')
        }, 2000);
     }else{
      showMessage.error(data.data[0].msg)
     }
    } catch {
    };
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.label}>Crie sua conta</span>
          <h1 className={styles.title}>
            Fazer <span className={styles.titleAccent}>Cadastro</span>
          </h1>
        </div>

        <form onSubmit={handleTeste} className={styles.form} method="post">
          <DefaultInput
            id='email'
            className={styles.inputs}
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            placeholder='Email'
          />
          <DefaultInput
            id='name'
            className={styles.inputs}
            value={name}
            onChange={e => setName(e.currentTarget.value)}
            placeholder='Nome'
          />
          <DefaultInput
            id='senha'
            type='password'
            className={styles.inputs}
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            placeholder='Senha'
          />
          <button className={styles.botao}>
            Cadastrar
          </button>
        </form>

        <p className={styles.footer}>
          Já tem conta?
          <a href='/login' className={styles.footerLink}>Entrar</a>
        </p>
      </div>
    </div>
  )
  }
export default  SignupContent;