import React from 'react';
import { Sparkles } from 'lucide-react';
import './Navbar.css';

function Navbar2({onLogOutClick}) {
  const handleLogout = async(e) => {
    e.preventDefault()
    try{
      console.log("Attempting logout...")
      const response = await fetch('/api/logout', {
        method: "POST", 
        credentials: "include"
      })
      
      console.log("Logout response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Logout successful:", data)
        // Call the parent's onLogOutClick function to update app state
        onLogOutClick()
      } else {
        const errorData = await response.json()
        console.error("Logout failed:", response.status, errorData)
      }
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
            <a onClick={handleLogout}>Log Out</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar2;