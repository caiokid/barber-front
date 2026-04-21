import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { RouterLink } from "../Link";
import style from './styles.module.css'

function Menu() {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = !isAuthenticated ? (
    <>
      <RouterLink href="/">Início</RouterLink>
      <RouterLink href="/login">Login</RouterLink>
      <RouterLink href="/cadastrar">Signup</RouterLink>
    </>
  ) : (
    <>
      <RouterLink href="/employs/barbers" className={style.bookBtn}>Agendar</RouterLink>
      <RouterLink href="/marcado/confirmed">Meus Agendamentos</RouterLink>
      <RouterLink onClick={() => { logout(); setOpen(false); }} href="/">Sair</RouterLink>
    </>
  );

  return (
    <div className={style.menuWrap}>
      <RouterLink className={style.logo} href="/">
        KING <span className={style.logoAccent}>SIZE</span>
      </RouterLink>

      {/* Desktop nav */}
      <nav className={style.link}>
        {navItems}
      </nav>

      {/* Mobile 3-dot button */}
      <div className={style.mobileMenu} ref={dropdownRef}>
        <button className={style.dotsBtn} onClick={() => setOpen(o => !o)} aria-label="Menu">
          ⋮
        </button>

        {open && (
          <div className={style.dropdown}>
            {navItems}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
