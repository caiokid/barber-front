import { API_URL } from '../../config';
import { useEffect, useState } from "react";
import styles from './styles.module.css';

interface Func {
  id: string;
  name: string;
}

interface Api {
  barbers: Func[];
}

function EmploysContent() {
  const [funcionario, setFuncionario] = useState<Func[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const acharEmploys = async () => {
      try {
        const response = await fetch(`${API_URL}/employs/barbers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if(response.status == 401) {
          window.location.href = "/login";
          localStorage.removeItem('userId');
          window.location.reload();
        }


        if (!response.ok) throw new Error(`Não foram encontrados barbeiros`);

       

        const resposta: Api = await response.json();

        if (resposta.barbers){
          setFuncionario(resposta.barbers);
        } 
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    acharEmploys();
  }, []);

 
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.label}>Passo 1 de 3</span>
        <h1 className={styles.title}>
          Escolha seu <span className={styles.titleAccent}>Barbeiro</span>
        </h1>
        <p className={styles.subtitle}>Selecione o profissional de sua preferência para continuar.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
          <span className={styles.loadingText}>Carregando barbeiros</span>
        </div>
      ) : funcionario.length === 0 ? (
        <div className={styles.empty}>Nenhum barbeiro disponível no momento.</div>
      ) : (
        <div className={styles.grid}>
          {funcionario.map((b) => (
            <a key={b.id} href={`/marcar/service/${b.id}`} className={styles.card}>
              <div className={styles.avatar}>✂</div>
              <div className={styles.name}>{b.name}</div>
              <div className={styles.role}>Barbeiro</div>
              <span className={styles.btn}>Selecionar</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}




export default EmploysContent