import { API_URL } from '../../config';
import DefaultInput from '../Defaultinput';
import styles from './style.module.css';
import { useNavigate } from 'react-router-dom';
import { showMessage } from '../../messages/showMessage';
import { useState } from 'react';

function ForgotPasswordContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [emailCor, setCorEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await res.json();

      console.log(data);


     if (data.message === 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.') {
      showMessage.success(data.message);
      setTimeout(() => {
      navigate('/login');
      }, 2000);
     } else {
      const msg = data?.data?.[0]?.msg || data?.message || 'Erro ao enviar email'
      showMessage.error(msg)
    }  
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
    }
  };

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const emailValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setCorEmail(!isValidEmail(val) ? 'r' : 'b');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.label}>Esqueceu sua senha?</span>
          <h1 className={styles.title}>
            Recuperar <span className={styles.titleAccent}>Senha</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} method="post">
          <DefaultInput
            id="email"
            className={emailCor === 'r' ? styles.red : styles.inputs}
            onChangeCapture={e => emailValidation(e)}
            onChange={e => setEmail(e.currentTarget.value)}
            value={email}
            placeholder="Email"
          />
          <button className={styles.botao}>
            Enviar instruções
          </button>
        </form>

        <p className={styles.footer}>
          Lembrou a senha?
          <a href="/login" className={styles.footerLink}>Fazer Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordContent;
