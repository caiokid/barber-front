import { useEffect } from "react";
import MainTemplate from "../../Templates/MainTemplate";
import { API_URL } from "../../config";

function Suporte() {

  useEffect(() => {}, []);

  const iniciarSuporte = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/teste/suporte`, {
        method: "GET",
        credentials: "include"
      });
      await response.json();
    } catch (error) {
      console.error('Erro ao iniciar suporte:', error);
    }
  };

  return (
    <>
      <MainTemplate>
        <button onClick={iniciarSuporte}>Iniciar uma conversa com o suporte</button>
      </MainTemplate>
    </>
  );
}

export default Suporte;
