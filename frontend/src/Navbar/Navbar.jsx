import React from 'react';
import { Sparkles } from 'lucide-react';
import './Navbar.css';

function Navbar({onLoginClick, onSignupClick}) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href='/' className='navbar-link-wrapper'>
        <span className="navbar-logo">
          <span className="navbar-icon"> 
            <Sparkles className="h-6 w-6 text-[#3498db]" />
          </span>
          <span className="navbar-text">SmartSpend</span>
        </span>
        </a>
      </div>

      <div className="navbar-right">

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