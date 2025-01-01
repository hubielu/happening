import React from 'react';
/*import logo from '../../assets/logo.svg';*/
import ProfileDropdown from '../ProfileDropdown'; // Assuming ProfileDropdown is in the same directory
import './navbar.css';

{/*
  
  const Menu = () => (
  <>
    <p><a href="#home">Home</a></p>
    <p><a href="#wNI">What is NI?</a></p>
    <p><a href="#possibility">Open Air</a></p>
    <p><a href="#features">Case Studies</a></p>
    <p><a href="#blog">Library</a></p>
  </>
);

*/}

const Navbar = ({ user, onSignOut }) => {
  return (
    <div className="NI__navbar">
      <div className="NI__navbar-left">
      <a href="https://networkinsider.com" target="_self">
          <h2 className="gradient-text">Network Insider</h2>
        </a>
      </div>
      <div className="NI__navbar-links">
        {/*<div className="NI__navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="NI__navbar-links_container">
          <Menu />
        </div>*/}
      </div>
      <div className="NI__navbar-profile">
        <ProfileDropdown user={user} onSignOut={onSignOut} />
      </div>
    </div>
  );
};

export default Navbar;
