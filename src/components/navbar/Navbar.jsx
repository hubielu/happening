import React from 'react';
/*import logo from '../../assets/logo.svg';*/
import ProfileDropdown from '../ProfileDropdown'; // Assuming ProfileDropdown is in the same directory
import './navbar.css';


const Navbar = ({ user, onSignOut }) => {
  return (
    <div className="NI__navbar">
      <div className="NI__navbar-left">
      <a href="https://happening.college" target="_self">
          <h2 className="gradient-text">Happening.</h2>
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