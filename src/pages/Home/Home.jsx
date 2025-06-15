"use client";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/Home Componets/Footer';
import { Header } from '../../components/Home Componets/Header';
import { HeroandServices } from '../../components/Home Componets/HeroandServices';
import { UserContext } from '../../context/UserContext';
import './Home.css';



export const Home = ({}) => {
	const navigate = useNavigate();
	const {usuario, setUsuario} = useContext(UserContext);
	
	const redireccionlogin =()=>{
		navigate('/login',{replace:true})
	};
	return (
    <>
		<Header />
		<HeroandServices />
		<Footer />
	</>
	);
};

Home.propTypes = {};
