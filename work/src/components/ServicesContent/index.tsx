import { API_URL } from '../../config';
import { useEffect, useState } from "react";
import styles from './styles.module.css';
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { RouterLink } from "../Link";

interface Funcionario {
  nome: string;
  id: number;
  preco: string;
}

interface Owner {
  armazena: Funcionario[];
}

function ServicesContent() {
  const { funcionarioTeste } = useAuth();
  const [func, setFunc] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const { funcId } = useParams<{ funcId: string }>();

  funcionarioTeste.push(funcId);

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await fetch(`${API_URL}/marcar/service/${funcId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error('Erro na validação');

        const resposta: Owner = await response.json();
        if (resposta.armazena) setFunc(resposta.armazena);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, [funcId]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.label}>Passo 2 de 3</span>
        <h1 className={styles.title}>
          Escolha o <span className={styles.titleAccent}>Serviço</span>
        </h1>
        <p className={styles.subtitle}>Selecione o serviço que deseja realizar.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
          <span className={styles.loadingText}>Carregando serviços</span>
        </div>
      ) : func.length === 0 ? (
        <div className={styles.empty}>Nenhum serviço disponível.</div>
      ) : (
        <div className={styles.grid}>
          {func.map((serv) => (
            <RouterLink key={serv.id} href={`/marcar/${encodeURIComponent(serv.id)}`} className={styles.card}>
              <div className={styles.serviceName}>{serv.nome}</div>
              <div className={styles.servicePrice}>{serv.preco}</div>
              <div className={styles.arrow}>Selecionar →</div>
            </RouterLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesContent;
