import React from 'react';
import { BarChart3, BrainCircuit, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <BarChart3 size={24} />
        <span>AI Employee Analytics</span>
      </NavLink>

      <nav className="nav-links">
        {isAuthenticated && (
          <>
            <NavLink to="/" title="Dashboard"><LayoutDashboard size={18} />Dashboard</NavLink>
            <NavLink to="/employees" title="Employees"><Users size={18} />Employees</NavLink>
            <NavLink to="/recommendations" title="Recommendations"><BrainCircuit size={18} />AI</NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="user-chip">{user?.name}</span>
            <button className="icon-text-btn" type="button" onClick={handleLogout}>
              <LogOut size={18} />Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className="button ghost" to="/login">Login</NavLink>
            <NavLink className="button" to="/signup">Signup</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
