import React from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src={logo} alt="DCC Logo" className="logo-img" />
                </div>
                <nav className="nav">
                    <ul className="nav-list">
                        <li><HashLink smooth to="/#hero" className="nav-link">Home</HashLink></li>
                        <li><HashLink smooth to="/#about" className="nav-link">About</HashLink></li>
                        <li><HashLink smooth to="/#activities" className="nav-link">Activities</HashLink></li>
                        <li><HashLink smooth to="/#works" className="nav-link">Works</HashLink></li>
                        <li><HashLink smooth to="/#room" className="nav-link">Room</HashLink></li>
                        <li><HashLink smooth to="/#faq" className="nav-link">FAQ</HashLink></li>
                        <li><HashLink smooth to="/#contact" className="nav-link">Contact</HashLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
