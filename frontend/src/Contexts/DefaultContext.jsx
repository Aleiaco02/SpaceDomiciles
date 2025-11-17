import { createContext, useContext } from "react";

export const DefaultContext = createContext();

export function DefaultProvider({ children }) {
  const apiBaseUrl = "http://localhost:3000";

  return (
    <DefaultContext.Provider value={{ apiBaseUrl }}>
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}