import React, { useState } from 'react';
import { signOut } from 'firebase/auth';  // Import from the modular SDK
import { auth } from '../firebase';       // Import the auth object from firebase.js
import './ProfileDropdown.css';  // Import the CSS file for styles and animations

const ProfileDropdown = ({ user, onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);  // Use signOut from the modular SDK
      onSignOut();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <div className="profile-dropdown">
      <img
        src={user.photoURL}
        alt="Profile"
        className="profile-photo"
        onClick={handleDropdownToggle}
      />
      <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
        <div className="user-info">
          <p>{user.displayName}</p>
          <p>{user.email}</p>
        </div>
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;