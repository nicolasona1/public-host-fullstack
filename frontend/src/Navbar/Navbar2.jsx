import React from 'react';
import { Sparkles } from 'lucide-react';
import './Navbar.css';
// CHANGE: import logout helper (hits backend + sends cookies)
import { logout } from "../api"; // if path breaks here, try "./api"

function Navbar2({onLogOutClick}) {
  const handleLogout = async(e) => {
    e.preventDefault()
    try{
      console.log("Attempting logout...")
      // CHANGE: use helper instead of raw fetch
      const data = await logout();
      console.log("Logout successful:", data)
      onLogOutClick() // CHANGE: keep your callback
    } catch(err){
      console.error("Logout error:", err)
    }
  }
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href='/' className='navbar-link-wrapper'>
        <span className="navbar-logo">
          <Sparkles className="h-6 w-6 text-[#3498db]" />
          SmartSpend</span>
        </a>
      </div>

      <div className="navbar-right">
        <div className="dropdown">
          <button className="dropbtn">Account ▾</button>
          <div className="dropdown-content">
            {/* CHANGE: anchor is fine since we preventDefault, keeping your UI */}
            <a onClick={handleLogout}>Log Out</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar2;
