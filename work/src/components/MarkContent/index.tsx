/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import { useAuth } from "../../Auth/AuthContext";
import style from './style.module.css'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { showMessage } from '../../messages/showMessage';

interface Service {
  id: string;
  nome: string;
  preco: string;
  desc: string;
  duration: string;
}

interface ServiceGet {
  jobs: Service[];
}

interface BarberCalendarSlot {
  date: Date;
  formattedDate: string;
  day: number;
  month: string;
  dayOfWeek: string;
  available: boolean;
  timeSlots: (string|number)[];
}

function MarkContent() {

  const [occupiedSlots, setOccupiedSlots] = useState<{startTime: string; endTime: string; month: string; barberId: string}[]>([]);
  const {serviçoTeste,funcionarioTeste} = useAuth();
  const { services } = useParams<{ services: string | never }>();
  const [selectedDate, setSelectedDate] = useState<BarberCalendarSlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | number>('');
  const [service, setService] = useState<Service | null>(null);
  const [calendar, setCalendar] = useState<BarberCalendarSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const navigate = useNavigate();

  // Funcionario teste é o id do funcionario, se não tiver, redireciona para a home    
  if(funcionarioTeste.length === 0){
    return <Navigate to="/" replace />;
  }
  //    

 

  // Aqui irá trazer do database os horários que já estão no database
  const fetchOccupiedSlots = async () => {
    try {
      const response = await fetch(`http://localhost:8080/times/check`, {
        credentials: "include"
      });
      const data = await response.json();
      setOccupiedSlots(data);
    } catch (error) {
      console.error('Erro ao buscar horários ocupados:', error);
      setOccupiedSlots([]);
    }
  };

  useEffect(() => {
    fetchOccupiedSlots();
  }, []);


  const fetchServices = async () => {
    try {
      const response = await fetch(`http://localhost:8080/marcar/services/${services}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data: ServiceGet = await response.json();
      if (data.jobs && data.jobs.length > 0) setService(data.jobs[0]);
    } catch (error) {
        console.error('Erro ao buscar serviço:', error);
      }
    };

  useEffect(() => {
    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime]);

  const toMinutes = (time: string | number): number => {
    const [h, m] = time.toString().split(':').map(Number);
    return h * 60 + m;
  };

  // Se o horário estiver ocupado para este funcionário neste dia não irá retornar nada para o cliente
  const isTimeOccupied = (data: string, horario: string | number): boolean => {
    const slotMin = toMinutes(horario);
    return occupiedSlots.some(slot => {
      if (slot.barberId !== funcionarioTeste[0]) return false;
      if (slot.month !== data) return false;
      const inicioMin = toMinutes(slot.startTime);
      const fimMin   = toMinutes(slot.endTime);
      return slotMin >= inicioMin && slotMin < fimMin;
    });
  };
  
  serviçoTeste.push(services);

  const generateBarberCalendar = (startDate: Date): BarberCalendarSlot[] => {
    const calendarData: BarberCalendarSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 5);

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    const workingHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
    
    const closedDays = [0];
    
    const current = new Date(start);
    const now = new Date();
    const todayDate = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      const isWorkingDay = !closedDays.includes(dayOfWeek);
      const isPastDate = current < new Date(now.setHours(0, 0, 0, 0));
      const isToday = current.getDate() === todayDate && current.getMonth() === todayMonth && current.getFullYear() === todayYear;
      
      let availableTimeSlots = [...workingHours];
      
      if (isToday && !isPastDate) {
        availableTimeSlots = workingHours.filter(timeSlot => {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          return hours > currentHour || (hours === currentHour && minutes > currentMinutes);
        });
      }
      
      // FILTRA HORÁRIOS OCUPADOS para todas as datas
      const dataFormatada = current.toLocaleDateString('pt-BR');
      availableTimeSlots = availableTimeSlots.filter(timeSlot => {
        return !isTimeOccupied(dataFormatada, timeSlot);
      });
      
      calendarData.push({
        date: new Date(current),
        formattedDate: dataFormatada,
        day: current.getDate(),
        month: monthNames[current.getMonth()],
        dayOfWeek: dayNames[dayOfWeek],
        available: isWorkingDay && !isPastDate,
        timeSlots: isWorkingDay && !isPastDate ? availableTimeSlots : []
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return calendarData;
  };

  useEffect(() => {
    setTimeout(() => {
      setCalendar(generateBarberCalendar(new Date()));
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occupiedSlots]);

  const isTimeSlotDisabled = (time: string | number): boolean => {
    if (!selectedDate) return false;
    return isTimeOccupied(selectedDate.formattedDate, time);
  };

  const getCurrentMonthDays = () => {
    return calendar.filter(day => 
      day.date.getMonth() === currentMonth.getMonth() && 
      day.date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const currentMonthDays = getCurrentMonthDays();
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long' });
  const year = currentMonth.getFullYear();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

   const confirmMarket = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,formatada:string,horario:string | number) => {
    e.preventDefault();
   try {
      const res = await fetch("http://localhost:8080/marcado/horario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({clock:horario, mesExato:formatada, serviçoId:services,funcId:funcionarioTeste[0]}),
      });
 
      const data = await res.json();

      if(data.message === 'Appointment scheduled successfully!'){
        showMessage.success('agendado com sucesso!');
        setTimeout(()=>{ 
        navigate("/marcado/confirmed", { replace: true });
        },2000)
 
    }} catch {
    }
  };

  return (
    <div className={style['barber-calendar-container']}>
      <div className={style['pageHeader']}>
        <span className={style['pageLabel']}>Passo 3 de 3</span>
        <h1 className={style['pageTitle']}>
          Escolha o <span className={style['pageTitleAccent']}>Horário</span>
        </h1>
        <p className={style['pageSubtitle']}>Selecione a data e o horário desejados.</p>
      </div>

      <div className={style['calendar-content']}>
        <div className={style['month-calendar']}>
          <div className={style['month-navigation']}>
            <button onClick={goToPreviousMonth} className={style['nav-button']}>
              ‹
            </button>
            <h2>{monthName} {year}</h2>
            <button onClick={goToNextMonth} className={style['nav-button']}>
              ›
            </button>
          </div>

          <div className={style['week-days-header']}>
            {weekDays.map(day => (
              <div key={day} className={style['week-day-cell']}>{day}</div>
            ))}
          </div>

          <div className={style['days-grid']}>
            {Array.from({ length: currentMonthDays[0]?.date.getDay() || 0 }).map((_, index) => (
              <div key={`empty-${index}`} className={style['day-cell empty']}></div>
            ))}
            
            {currentMonthDays.map(day => (
              <div
                key={day.formattedDate}
                className={`${style['day-cell']} ${
                  !day.available ? 'unavailable' :
                  selectedDate?.formattedDate === day.formattedDate ? 'selected' : 'available'
                }`}
                onClick={() => day.available && setSelectedDate(day)}
              >
                <span className={style['day-number']}>{day.day}</span>
                {day.available && <div className="available-dot"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className={style['time-selection']}>
          {selectedDate ? (
            <div className={style['time-slots-container']}>
              <h3>
                📅 {selectedDate.dayOfWeek}, {selectedDate.day} de {selectedDate.month}
              </h3>
              
              <div className={style['time-slots-grid']}>
                {selectedDate.timeSlots.map(time => {
                  const ocupado = isTimeSlotDisabled(time);
                  return (
                    <button
                      key={time}
                      className={`${style['time-slot']} ${
                        selectedTime === time ? 'selected' : ''
                      } ${ocupado ? style['occupied'] : ''}`}
                      onClick={() => !ocupado && setSelectedTime(time)}
                      disabled={ocupado}
                    >
                      {time} {ocupado && '(Ocupado)'}
                    </button>
                  );
                })}
              </div>
       
                {/* Trazer o GET */}

      
              {selectedTime && (
                <div className={style['booking-summary']}>
                  <div className={style['booking-details']}>
                    <h4>Resumo do Agendamento:</h4>
                    <p>📅 <strong>Data:</strong> {selectedDate.formattedDate}</p>
                    <p>⏰ <strong>Horário:</strong> {selectedTime}</p>
                    <p>🪒 <strong>Serviço:</strong> {service?.nome ?? '—'}</p>
                    <p>💰 <strong>Valor:</strong> R$ {service?.preco ?? '—'}</p>
                    <p>⏱ <strong>Duração:</strong> {service?.duration ?? '—'}</p>
                  </div>
                  
                  <button 
                    className={style['confirm-booking-btn']}
                    onClick={e => confirmMarket(e,selectedDate.formattedDate,selectedTime)}
                  >
                    ✅ Confirmar Agendamento
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={style['no-selection']}>
              <div className={style['placeholder-icon']}>📅</div>
              <p>Selecione uma data disponível no calendário</p>
              <small>Dias em cinza estão indisponíveis</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MarkContent;