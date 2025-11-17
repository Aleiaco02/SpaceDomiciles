import { createContext, useContext, useState } from "react";

const DefaultContext = createContext();

function DefaultProvider({ children }) {
  return (
    <DefaultContext.Provider value={""}>{children}</DefaultContext.Provider>
  );
}

function useDefaultContext() {
  const context = useContext(DefaultContext);
  return context;
}

export { DefaultProvider, useDefaultContext };
