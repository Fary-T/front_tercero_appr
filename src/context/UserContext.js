import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    id_usuario: 0,
    correo: "",
    username: "",
    password: "",
    nombre: "s/n",
    apellido: "s/n",
    tipo: 0,
    activo: 0,
    cedula: "",
    telefono: "",
    rol: "",
  });

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
