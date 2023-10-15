// src/UserContext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [tokenId, setTokenId] = useState(null);

  return (
    <UserContext.Provider value={{ tokenId, setTokenId }}>
      {children}
    </UserContext.Provider>
  );
};
