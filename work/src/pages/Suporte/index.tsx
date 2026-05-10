import { useEffect } from "react";
import MainTemplate from "../../Templates/MainTemplate";
import io from 'socket.io-client';



function Suporte() {


  useEffect(() => {

  const socket = io('http://localhost:8080', {
    withCredentials: true,
    transports: ['websocket'],
  });

  socket.on("usuario", (data) => {
    console.log('📨 Mensagem do backend:', data);
  });



}, []);

// 🎯 Botão para INICIAR suporte (chama API UMA vez)
const iniciarSuporte = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  const response = await fetch('http://localhost:8080/teste/suporte', {
    method: "GET",
    credentials: "include"
  });
  
  const data = await response.json();
  console.log('API respondeu:', data);
  // API já disparou o socket automaticamente!
};
     
  return (
    <>
      <MainTemplate>

        <button onClick={iniciarSuporte}>Iniciar uma conversa com o suporte</button>  
   
      </MainTemplate>
    </>
    )
  }
  
export default Suporte;