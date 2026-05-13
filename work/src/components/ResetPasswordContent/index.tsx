import { API_URL } from '../../config';
import DefaultInput from '../Defaultinput';
import styles from './style.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { showMessage } from '../../messages/showMessage';
import { useState } from 'react';

function ResetPasswordContent() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [novaSenhaCor, setNovaSenhaCor] = useState<string>('');
  const [confirmarSenhaCor, setConfirmarSenhaCor] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      showMessage.error('As senhas não coincidem!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: novaSenha }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.message === 'Senha redefinida com sucesso!') {
        showMessage.success(data.message);
        navigate('/login');
        return;
      }

      showMessage.error(data.message);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
    }
  };

  const senhaValidation = (setter: (v: string) => void) => (e: React.FormEvent<HTMLInputElement>) => {
    setter(e.currentTarget.value.length < 5 ? 'r' : 'b');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.label}>Redefina sua senha</span>
          <h1 className={styles.title}>
            Nova <span className={styles.titleAccent}>Senha</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} method="post">
          <DefaultInput
            id="novaSenha"
            type="password"
            className={novaSenhaCor === 'r' ? styles.red : styles.inputs}
            onChangeCapture={senhaValidation(setNovaSenhaCor)}
            onChange={e => setNovaSenha(e.currentTarget.value)}
            value={novaSenha}
            placeholder="Nova senha"
          />
          <DefaultInput
            id="confirmarSenha"
            type="password"
            className={confirmarSenhaCor === 'r' ? styles.red : styles.inputs}
            onChangeCapture={senhaValidation(setConfirmarSenhaCor)}
            onChange={e => setConfirmarSenha(e.currentTarget.value)}
            value={confirmarSenha}
            placeholder="Confirmar nova senha"
          />
          <button className={styles.botao}>
            Redefinir senha
          </button>
        </form>

        <p className={styles.footer}>
          <a href="/login" className={styles.footerLink}>Voltar para o login</a>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordContent;
