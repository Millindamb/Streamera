import { createContext, useState, useEffect } from "react";

export const isAuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && token !== "null" && token !== "undefined") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <isAuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </isAuthContext.Provider>
  );
};
