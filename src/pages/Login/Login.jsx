"use client";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Login.css';

export const Login = ({}) => {
	const navigate = useNavigate();
	const {usuario, setUsuario} = useContext(UserContext);

	const redireccionHome =()=>{
		navigate('/home',{replace:true})
	};
	return (
		<div className='login'>
 			<h1>Este es el login</h1>
			<h2>valor usuario: {usuario.nombre||'sin datos'}</h2>
			<button onClick={redireccionHome}>botón home</button>
 		</div>
	);
};

Login.propTypes = {};
