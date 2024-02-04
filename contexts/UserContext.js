import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [location, setLocation] = useState({
    latitude: 37.498095,
    longitude: 127.02761,
    name: "강남역",
  });

  return (
    <UserContext.Provider value={{ email, setEmail, location, setLocation }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
