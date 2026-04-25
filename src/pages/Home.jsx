import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Activities from '../components/Activities';
import Works from '../components/Works';
import Stats from '../components/Stats';
import Room from '../components/Room';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Activities />
            <Works />
            <Stats />
            <Room />
            <FAQ />
            <Contact />
        </>
    );
};

export default Home;
