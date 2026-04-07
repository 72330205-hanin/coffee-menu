import { useState } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminLayout.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoUrl = `${API_BASE}/uploads/logo.png`;

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-brand">
            <img src={logoUrl} alt="Logo" className="admin-topbar-logo" />
            <span className="admin-topbar-brand-text">World in a Cup</span>
          </div>

          <button
            className="admin-mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuOutlinedIcon />
          </button>
        </div>

        <div className="admin-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;