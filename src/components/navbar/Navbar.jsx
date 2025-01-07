import React, { lazy, Suspense } from 'react';
import './navbar.css';

const ProfileDropdown = lazy(() => import('../ProfileDropdown'));

const Navbar = ({ user, onSignOut }) => {
  return (
    <div className="NI__navbar">
      <div className="NI__navbar-left">
        <a href="https://happening.college" target="_self">
          <h2 className="gradient-text">Happening.</h2>
        </a>
      </div>
      <div className="NI__navbar-links">
      </div>
      <div className="NI__navbar-profile">
        <Suspense fallback={<div className="profile-photo-placeholder"></div>}>
          <ProfileDropdown user={user} onSignOut={onSignOut} />
        </Suspense>
      </div>
    </div>
  );
};

export default Navbar;
