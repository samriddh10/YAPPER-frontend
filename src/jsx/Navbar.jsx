import React from 'react';
import './css/Navbar.css';
import { Link } from 'react-router-dom';
import profImage from '../assets/prof.png';

export default function Navbar() {
    return (
        <nav className="navbar">
        <ul>
            <li><Link to="/">Home</Link></li>  
            
            
            

        </ul>
        <ul>
        <li className="admin">
          
            <img
              src={profImage}
              alt="Admin Panel"
              style={{ width: "30px", height: "30px" }}
            />
          

          <div id='tooltip'> 

            <Link to="/profile">Profile</Link>
            <Link to="/change-password">Change Password</Link>
            <Link to ="/logout">Logout</Link>
            
          </div>
        </li>
        </ul>
    </nav>
    );
}
