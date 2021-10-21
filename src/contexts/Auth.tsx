import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import api from "../service/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
  }
}

interface AuthContextData {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<User | null>(null);

  const signInUrl = 
    `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}`

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('/authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    api.defaults.headers.common.authorization = `Bearer ${token}`

    localStorage.setItem('@DoWhile:token', token);

    setUser(user);
  }
  // envia código do github pra rota '/authenticate
  // salva o token em localstorage, e envia token no headers.authorization
  // salva user no estado
  function signOut() {
    setUser(null);
    localStorage.removeItem('@DoWhile:token');
  }

  // Buscar token em localstorage, setar headers.authorization, & salvar no estado user
  useEffect(() => {
    const token = localStorage.getItem('@DoWhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('/profile').then(response => {
        setUser(response.data);
      });
    }

  }, []);

  // Pegar código do github e remover da url & executar função signIn
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [ urlWithoutCode, githubCode ] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
}