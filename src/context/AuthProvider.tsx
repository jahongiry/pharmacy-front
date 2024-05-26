import {createContext, useState} from "react";

interface ThemeContextType {
  userData: Record<string, string> | null;
  helperSetUserData?: (data: Record<string, string>) => void;
}

// Создание контекста
const initialThemeContext: ThemeContextType = {
  userData: null
};

export const AuthContext = createContext(initialThemeContext)

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<Record<string, string> | null>(null)

  const helperSetUserData = (data: Record<string, string>) => {
    setUserData(data)

  }

  const contextValue: ThemeContextType = {
    userData,
    helperSetUserData
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );

}
