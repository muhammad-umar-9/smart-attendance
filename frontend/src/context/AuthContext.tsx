import React, { ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from '../api/auth';
import { setAuthToken } from '../api/client';

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextValue>({
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('access_token');
        if (t) {
          setToken(t);
          setAuthToken(t);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const data = await apiLogin(email, password);
    const t = data.access_token as string;
    await AsyncStorage.setItem('access_token', t);
    setToken(t);
    setAuthToken(t);
  }

  async function signOut() {
    await AsyncStorage.removeItem('access_token');
    setToken(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}
