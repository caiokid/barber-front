import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import styles from './styles.module.css';

interface Services {
  id: number;
  nome: string;
  preco: string;
  desc: string;
  duration: string;
}

interface ServicesGet {
  jobs: Services[];
}

interface Barber {
  id: string;
  name: string;
  imageUrl?: string;
}

interface BarbersGet {
  barbers: Barber[];
}


interface Comment {
  id: number;
  text:string;
  author: string;
}

interface CommentGet{
 comments: Comment[]  
}


function HomeContent() {
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Services[]>([]);
  const [team, setTeam] = useState<Barber[]>([]);
  const [testimonials, setTestimonials] = useState<Comment[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [commentError, setCommentError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const changeSlide = (newIndex: number) => {
    setAnimating(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setCarouselIndex(newIndex);
      setAnimating(true);
    }));
  };

  const prevTestimonial = () => changeSlide((carouselIndex - 1 + testimonials.length) % testimonials.length);
  const nextTestimonial = () => changeSlide((carouselIndex + 1) % testimonials.length);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setAnimating(false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setCarouselIndex(i => (i + 1) % testimonials.length);
        setAnimating(true);
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSending(true);
    setCommentError('');
    try {
      const res = await fetch('http://localhost:8080/marcado/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) throw new Error();
      setCommentText('');
      setSent(true);
      setTimeout(() => {setSent(false); window.location.reload()} , 2000);
    } catch {
      setCommentError('Não foi possível enviar. Tente novamente.');
    } finally {
      setSending(false);
    }
  }


  useEffect(() => {
    const getComments = async () => {
      const response = await fetch(`http://localhost:8080/comments/show`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error('Erro ao buscar os comentários');
      const comentario:CommentGet = await response.json();
      if (comentario.comments) setTestimonials(comentario.comments);
    };
    getComments(); 
  }, []);



  useEffect(() => {
    const getServices = async () => {
      const response = await fetch(`http://localhost:8080/marcar/services/home`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error('Erro na validação');
      const resposta: ServicesGet = await response.json();
      if (resposta.jobs) setService(resposta.jobs);
    };
    getServices();
  }, []);

  useEffect(() => {
    const getBarbers = async () => {
      const response = await fetch(`http://localhost:8080/employs/barbers/home`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error('Erro ao buscar barbeiros');
      const barb: BarbersGet = await response.json();
      if (barb.barbers) {
        setTeam(barb.barbers)
        return barb.barbers
      };
    };
    getBarbers();
  }, []);


  const bookingHref = isAuthenticated ? "/employs/barbers" : "/login";

  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Est. 2018 · São Paulo</span>

          <h1 className={styles.heroTitle}>
            A Arte do<br />
            <span className={styles.heroTitleAccent}>Corte Perfeito</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Tradição, precisão e estilo em cada detalhe.
            Onde a barbearia clássica encontra o design contemporâneo.
          </p>

          <div className={styles.heroCtas}>
            <Link to={bookingHref} className={styles.btnPrimary}>
              Agendar Agora
            </Link>
            <a href="#servicos" className={styles.btnSecondary}>
              Ver Serviços
            </a>
          </div>
        </div>

        <div className={styles.heroScrollHint}>
          <div className={styles.scrollLine} />
          <span>scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.statsBar}>
        <div className={styles.statsInner}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>7+</div>
            <div className={styles.statLabel}>Anos de experiência</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4k+</div>
            <div className={styles.statLabel}>Clientes atendidos</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4</div>
            <div className={styles.statLabel}>Barbeiros especialistas</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>5★</div>
            <div className={styles.statLabel}>Avaliação no Google</div>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className={styles.section} id="servicos">
        <div className={styles.sectionInner}>
          <div className={styles.servicesHeader}>
            <div>
              <span className={styles.sectionLabel}>O que oferecemos</span>
              <h2 className={styles.sectionTitle}>
                Nossos <span className={styles.sectionTitleItalic}>Serviços</span>
              </h2>
            </div>
            <p className={styles.sectionDesc}>
              Cada serviço executado com produtos premium e técnicas refinadas ao longo de anos de prática.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {service.map((s) => (
              <div key={s.id} className={styles.serviceCard}>
                <div className={styles.serviceName}>{s.nome}</div>
                <div className={styles.serviceDesc}>{s.desc}</div>
                <div className={styles.servicePrice}>
                  {s.preco}
                  <span className={styles.servicePriceSuffix}>· {s.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="equipe">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Quem nos faz</span>
          <h2 className={styles.sectionTitle}>
            Nossa <span className={styles.sectionTitleItalic}>Equipe</span>
          </h2>

          <div className={styles.teamGrid}>
            {team.map((b) => (
              <div key={b.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  {b.imageUrl
                    ? <img src={b.imageUrl} alt={b.name} className={styles.teamAvatarImg} />
                    : <span className={styles.teamAvatarPlaceholder}>✂</span>
                  }
                  <div className={styles.teamAvatarGold} />
                </div>
                <div className={styles.teamName}>{b.name}</div>
                <div className={styles.teamRole}>Barbeiro</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──             //Usar os valores da api de comments here */}
      <section className={styles.section} id="depoimentos">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>O que dizem</span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleItalic}>Depoimentos</span>
          </h2>



          {testimonials.length > 0 && (
            <div className={styles.carouselWrapper}>
              <button className={styles.carouselBtn} onClick={prevTestimonial}>‹</button>

              <div className={`${styles.testimonialCard} ${animating ? styles.carouselFade : ''}`}>
                <span className={styles.testimonialQuote}>"</span>
                <p className={styles.testimonialText}>{testimonials[carouselIndex].text}</p>
                <div className={styles.testimonialAuthor}>{testimonials[carouselIndex].author}</div>
              </div>

              <button className={styles.carouselBtn} onClick={nextTestimonial}>›</button>

              <div className={styles.carouselDots}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.carouselDot} ${i === carouselIndex ? styles.carouselDotActive : ''}`}
                    onClick={() => changeSlide(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className={styles.commentFormWrap}>
              <span className={styles.commentFormTitle}>Deixe sua avaliação</span>

              {sent ? (
                <div className={styles.commentSuccess}>
                  <span className={styles.commentSuccessIcon}>✓</span>
                  Comentário enviado com sucesso!
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                  <textarea
                    ref={textareaRef}
                    className={styles.commentTextarea}
                    placeholder="Conte como foi sua experiência na King Size..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    maxLength={300}
                    rows={3}
                  />
                  <div className={styles.commentFormFooter}>
                    <span className={styles.commentCharCount}>{commentText.length}/300</span>
                    {commentError && <span className={styles.commentError}>{commentError}</span>}
                    <button
                      type="submit"
                      className={styles.commentSubmitBtn}
                      disabled={sending || !commentText.trim()}
                    >
                      {sending ? 'Enviando...' : 'Publicar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── BOOKING CTA BAND ── */}
      <section className={styles.bookingBand}>
        <div className={styles.bookingBandInner}>
          <h2 className={styles.bookingBandTitle}>
            Pronto para o<br />corte perfeito?
          </h2>
          <p className={styles.bookingBandSub}>
            Agende online em segundos. Sem fila, sem espera.
          </p>
          <Link to={bookingHref} className={styles.btnDark}>
            Reservar Horário
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                KING <span className={styles.footerLogoAccent}>SIZE</span>
              </div>
              <p className={styles.footerBrandDesc}>
                Barbearia premium no coração de São Paulo. Tradição e excelência desde 2018.
              </p>
            </div>

            <div className={styles.footerCol}>
              <h4>Navegação</h4>
              <ul>
                <li><a href="#servicos">Serviços</a></li>
                <li><a href="#equipe">Equipe</a></li>
                <li><a href="#depoimentos">Depoimentos</a></li>
                <li><Link to={bookingHref}>Agendar</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Horários</h4>
              <ul>
                <li>Seg–Sex: 9h às 20h</li>
                <li>Sábado: 9h às 18h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Contato</h4>
              <ul>
                <li>(11) 99999-9999</li>
                <li>contato@kingsize.com</li>
                <li>Rua dos Barbeiros, 42</li>
                <li>São Paulo – SP</li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span className={styles.footerCopyright}>
              © {new Date().getFullYear()} Barbearia King Size. Todos os direitos reservados.
            </span>
            <div className={styles.footerSocials}>
              <a href="#">Instagram</a>
              <a href="#">WhatsApp</a>
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomeContent;
