import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Message from '../components/Message';
import Activities from '../components/Activities';
import Works from '../components/Works';
import Room from '../components/Room';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Message />
            <Activities />
            <Works />
            <Room />
            <FAQ />
            <Contact />
        </>
    );
};

export default Home;
