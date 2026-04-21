import { useEffect, useState } from "react";
import styles from './styles.module.css';
import { showMessage } from "../../messages/showMessage";

interface Marcado {
  _id: string;
  barberName: string;
  jobName: string;
  month: string;
  startTime: string;
  endTime: string;
  price: string;
}

interface ApiResponse {
  name?: string;
  appointments?: Marcado[];
  message?: string;
}

function MarcadosContent() {
  const [marcados, setMarcados] = useState<Marcado[]>([]);

  useEffect(() => {
    const fetchMarcados = async () => {
      try {
        const response = await fetch('http://localhost:8080/marcado/confirmed', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        if(response.status == 401) {
          window.location.href = "/login";
          localStorage.removeItem('userId');
          window.location.reload();
        }
        
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const data: ApiResponse = await response.json();
        if (data.appointments && data.appointments.length > 0) setMarcados(data.appointments);
      } catch {
      }
    };

    fetchMarcados();
  }, []);

  function Desmarque(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    e.preventDefault();

    fetch('http://localhost:8080/marcado/deletar', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idarray: id }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then((data) => {
        if (data.ok) {
          setMarcados(prev => prev.filter(m => m._id !== id));
          showMessage.error('Deletado com Sucesso');
          window.location.reload();
        }
      })
      .catch(err => console.error('Erro ao desmarcar:', err));
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.label}>Sua agenda</span>
        <h1 className={styles.title}>
          Meus <span className={styles.titleAccent}>Agendamentos</span>
        </h1>
      </div>

      {marcados.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✂</div>
          <div className={styles.emptyTitle}>Nenhum agendamento</div>
          <p className={styles.emptyText}>Você ainda não tem horários marcados.</p>
          <a href="/employs/barbers" className={styles.emptyBtn}>Agendar agora</a>
        </div>
      ) : (
        <div className={styles.list}>
          {marcados.map((value, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardInfo}>
                <div className={styles.cardIcon}>✂</div>

                <div className={styles.cardMain}>
                  <div className={styles.barberName}>{value.barberName}</div>
                  <div className={styles.serviceName}>{value.jobName}</div>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Data</span>
                    <span className={styles.metaValue}>{value.month}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Horário</span>
                    <span className={styles.metaValue}>{`${value.startTime} até ${value.endTime}`}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Valor</span>
                    <span className={styles.metaValueHighlight}>R$ {value.price}</span>
                  </div>
                </div>
              </div>

              <button className={styles.cancelBtn} onClick={(e) => Desmarque(e, value._id)}>
                Desmarcar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default MarcadosContent; 