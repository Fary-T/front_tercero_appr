"use client";
import React from 'react';
import './Planes.css';
import PropTypes from 'prop-types';
import Header from '../../components/planescomponents/Header';
import HeroBanner from '../../components/planescomponents/HeroBanner';
import PlanesSection from '../../components/planescomponents/PlanesSection';
import Testimonios from '../../components/planescomponents/Testimonios';
import Footer from '../../components/planescomponents/Footer';
import { Box } from '@mui/material';

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
