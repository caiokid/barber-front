import React, { createContext, useContext, useMemo, useState} from "react";

type AuthContextType = {
  userId: string | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  funcionarioTeste: Array<string|undefined>;
  serviçoTeste: Array<string|undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const funcionarioTeste: Array<string|undefined> = [];
const serviçoTeste: Array<string|undefined> = [];

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("userId"));

  const login = (id: string) => {
    setUserId(id);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  };

  const value = useMemo(
    () => ({ userId, isAuthenticated: !!userId, login, logout, funcionarioTeste, serviçoTeste }),
    [userId]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider />");
  return ctx;
};
