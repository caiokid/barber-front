 
import {useNavigate, useParams } from "react-router-dom";
import Container from "../Container";
import styles from './styles.module.css'
import Content from "../Content";
import { useEffect, useState} from "react";
import { useAuth } from "../../Auth/AuthContext";
import { Navigate} from "react-router-dom";
import { teste } from "../../tools/tools";
import { showMessage } from "../../messages/showMessage";




function ShowTimeContent() {

  const navigate = useNavigate();

  console.log(teste )

  const {mes} = useParams<{mes:string}>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hora, setHora] = useState<any[]>([]); 
  const { services } = useParams<{ services: string | never }>();


  const {funcionarioTeste,serviçoTeste} = useAuth();
  serviçoTeste.push(services)
  console.log(services)
 


  const verificarTodosHorarios = async () => {
    const todosHorarios = [];
    for (let index = 9; index <= 19; index++) {
      todosHorarios.push(`${index}:00`);
    }
    const resultados = [];
    for (const horario of todosHorarios) {
      try {
        const response = await fetch(`http://localhost:8080/marcar/services/${mes}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({horario: horario, mexExato: mes}),
          credentials: "include"
        });
        const data = await response.json();
        resultados.push({ 
          horario, 
          disponivel: data.livre,
          message: data.message 
        });
      } catch (error) {
        console.error(`Erro no horário ${horario}:`, error);
      }
    }
    setHora(resultados);
  };
  
  useEffect(() => {
    if (mes) {
      setTimeout(()=>{ 
        verificarTodosHorarios();
      },10)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes]);




  async function setTime(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,clock:string) {
    e.preventDefault();
     
     try {
       const opa = teste ? teste.find((_item, index) => index.toString() === mes)?.mes?.toString() : null

        const response = await fetch(`http://localhost:8080/marcado/horario`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            funcId: funcionarioTeste[0],
            serviçoId: serviçoTeste[0],
            clock:clock,
            mesExato:opa,
            mesIndex:mes
          })
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
         if(data.message){
         showMessage.success(data.message)
         setTimeout(()=>{
          navigate('/marcado/confirmed')
         },2000)
        }
     } catch (error) {
    console.error('Erro ao marcar horário:', error);
  }
}   



  if(!serviçoTeste[0] && !funcionarioTeste[0]){
  return <Navigate to="/" replace />;
  }

  return(
    <>  
      {mes && (
        <Container className={styles.containercenter}>     
          <h2 className="flex justify-center">Horários disponíveis</h2> 
          
          {/* Mostra TODOS os horários verificados */}
          <div className="my-4">
            <h3 className="text-center">Todos os horários:</h3>
            <Content className="flex justify-center gap-2 my-5 flex-wrap">
              {hora.map((item, index) => (

                item.disponivel === true &&(
                  <a key={index} onClick={(e) => setTime(e,item.horario)} >{item.horario}</a> 
                )
              ))}
            </Content>
          </div>
        </Container>
      )} 
    </>
  )
}

export default ShowTimeContent;