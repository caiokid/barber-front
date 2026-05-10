interface ApiResponse {
  service?: string;
  hora?: Marcado[];
  message?: string;
  times?: string;
}




export const fetchMarcados = async () => {
    try {
        const response = await fetch('http://localhost:8080/marcado/confirmed', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const data: ApiResponse = await response.json();
        console.log(data)
        if (data.hora && data.hora.length > 0) setMarcados(data.hora);
    } catch (err) {
        console.log(err);
    }
};