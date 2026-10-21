'use client';

import React from 'react';
// import { Fraunces } from 'next/font/google';
import Navbar from '../components/landing/navbar';
import HeroSection from '../components/landing/hero-section';
import ServicesSection from '../components/landing/services-section';
import HowItWorksSection from '../components/landing/how-it-works-section';
import AudienceSection from '../components/landing/audience-section';
import ClearInfoSection from '../components/landing/clear-info-section';
import Footer from '../components/landing/footer';

export default function Home(): React.JSX.Element {
  return (
    <div className="font-(family-name:--font-roboto-slab)">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <AudienceSection />
        <ClearInfoSection />
      </main>
      <Footer />
    </div>
  );
}