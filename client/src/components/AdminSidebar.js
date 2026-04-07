import { Link, useLocation } from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CoffeeOutlinedIcon from '@mui/icons-material/CoffeeOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import '../styles/AdminSidebar.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FRONTEND_BASE = process.env.PUBLIC_URL || '/';

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const logoUrl = `${API_BASE}/uploads/logo.png`;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      ></div>

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo-wrap">
              <img src={logoUrl} alt="Logo" className="admin-sidebar-logo" />
            </div>

            <div className="admin-sidebar-brand-text">
              <h3>World in a Cup</h3>
            </div>

            <button className="admin-sidebar-close" onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          <div className="admin-sidebar-section-title">Content Management</div>

          <nav className="admin-sidebar-nav">
            <Link
              to="/admin/dashboard"
              className={`admin-sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
              onClick={onClose}
            >
              <AppsOutlinedIcon />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/home-section"
              className={`admin-sidebar-link ${isActive('/admin/home-section') ? 'active' : ''}`}
              onClick={onClose}
            >
              <HomeOutlinedIcon />
              <span>Home Section</span>
            </Link>

            <Link
              to="/admin/menu"
              className={`admin-sidebar-link ${isActive('/admin/menu') ? 'active' : ''}`}
              onClick={onClose}
            >
              <CoffeeOutlinedIcon />
              <span>Menu</span>
            </Link>

            <Link
              to="/admin/filter-bar"
              className={`admin-sidebar-link ${isActive('/admin/filter-bar') ? 'active' : ''}`}
              onClick={onClose}
            >
              <TuneOutlinedIcon />
              <span>Filter Bar</span>
            </Link>

            <Link
              to="/admin/about"
              className={`admin-sidebar-link ${isActive('/admin/about') ? 'active' : ''}`}
              onClick={onClose}
            >
              <InfoOutlinedIcon />
              <span>About Section</span>
            </Link>

            <div
              className="admin-sidebar-link"
              onClick={() => {
                onClose();
                window.location.href = FRONTEND_BASE;
              }}
            >
              <LaunchIcon />
              <span>View Website</span>
            </div>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-sidebar-logout"
            onClick={() => {
              onClose();
              window.location.href = FRONTEND_BASE;
            }}
          >
            <LogoutOutlinedIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;