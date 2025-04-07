import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      <div className={`sidebar-overlay ${isCollapsed ? 'hidden' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <span className="sidebar-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </span>
            {!isCollapsed && <span className="sidebar-logo-text">BlogPlatform</span>}
          </Link>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            )}
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <Link to="/" className={`sidebar-menu-link ${isActive('/')}`}>
                  <span className="sidebar-menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="sidebar-menu-text">Home</span>}
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="sidebar-menu-item">
                    <Link to="/new-post" className={`sidebar-menu-link ${isActive('/new-post')}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">Write Post</span>}
                    </Link>
                  </li>
                  
                  <li className="sidebar-menu-item">
                    <Link to="/favorite-posts" className={`sidebar-menu-link ${isActive('/favorite-posts')}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">Favorites</span>}
                    </Link>
                  </li>
                  
                  <li className="sidebar-menu-item">
                    <Link to={`/users/${user._id}/posts`} className={`sidebar-menu-link ${isActive(`/users/${user._id}/posts`)}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">My Posts</span>}
                    </Link>
                  </li>
                  
                  {user.role === "admin" && (
                    <li className="sidebar-menu-item">
                      <Link to="/admin" className={`sidebar-menu-link ${isActive('/admin')}`}>
                        <span className="sidebar-menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          </svg>
                        </span>
                        {!isCollapsed && <span className="sidebar-menu-text">Admin Dashboard</span>}
                      </Link>
                    </li>
                  )}
                  
                  <li className="sidebar-menu-item">
                    <Link to="/profile" className={`sidebar-menu-link ${isActive('/profile')}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">Profile</span>}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="sidebar-menu-item">
                    <Link to="/login" className={`sidebar-menu-link ${isActive('/login')}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">Login</span>}
                    </Link>
                  </li>
                  
                  <li className="sidebar-menu-item">
                    <Link to="/register" className={`sidebar-menu-link ${isActive('/register')}`}>
                      <span className="sidebar-menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                      </span>
                      {!isCollapsed && <span className="sidebar-menu-text">Register</span>}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {user && !isCollapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.username}</div>
                <button className="sidebar-logout" onClick={logout}>Log Out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="sidebar-skeleton">
      <div className="sidebar-skeleton-header">
        <div className="sidebar-skeleton-logo"></div>
      </div>
      <div className="sidebar-skeleton-content">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="sidebar-skeleton-item">
            <div className="sidebar-skeleton-icon"></div>
            <div className="sidebar-skeleton-text"></div>
          </div>
        ))}
      </div>
      <div className="sidebar-skeleton-footer">
        <div className="sidebar-skeleton-avatar"></div>
        <div className="sidebar-skeleton-user">
          <div className="sidebar-skeleton-name"></div>
          <div className="sidebar-skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;