import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav className='navbar'>
        <div className='navbar-brand'>
            ArticleChat
        </div>
        <ul className='nav-links'>
           <li><Link to='/'>New Chat</Link></li>
           <li><Link to='/about'>About</Link></li>
           <li><a href='Contact Us'>Contact</a></li>
        </ul>
    </nav>
  )
}

export default Navbar
