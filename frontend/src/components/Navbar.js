import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyApp</Link> {/* Link to the homepage */}
      </div>
      <div className="navbar-links">
        {!userInfo ? (
          <Link to="/signin" className="navbar-link">
            Sign In
          </Link>
        ) : (
          <button onClick={handleSignOut} className="navbar-link">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
