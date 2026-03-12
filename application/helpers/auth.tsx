import React from 'react';

type AuthContextType = {
  logout: () => Promise<void> | void;
  isAuth: boolean;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);
