import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";


export const AuthGuard =()=>{
const {usuario,setUsuario} = useContext(UserContext);
const validar = usuario.id_usuario && usuario.activo;
console.log(usuario);
return validar ? <Outlet/> : <Navigate replace to={'/home'}></Navigate>
}
export default AuthGuard;