import React from 'react';
import './Navbar.css';

function Navbar({onLoginClick, onSignupClick}) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">SmartSpend</span>
      </div>

      <div className="navbar-right">
        <a href="/" className="nav-link">Home</a>
        <a href="#" className="nav-link">About</a>
        <a href="#" className="nav-link">Why</a>

        <div className="dropdown">
          <button className="dropbtn">Account ▾</button>
          <div className="dropdown-content">
            <a onClick={onLoginClick}>Log In</a>
            <a onClick={onSignupClick}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
