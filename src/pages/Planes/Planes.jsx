"use client";
import Footer from '../../components/planescomponents/Footer';
import Header from '../../components/planescomponents/Header';
import HeroBanner from '../../components/planescomponents/HeroBanner';
import PlanesSection from '../../components/planescomponents/PlanesSection';
import Testimonios from '../../components/planescomponents/Testimonios';
import './Planes.css';

export const Planes = () => {
  return (
    <>
      <Header />
      <HeroBanner />
      <PlanesSection />
      <Testimonios />
      <Footer />
    </>
  )
}

Planes.propTypes = {};
