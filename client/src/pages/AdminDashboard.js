import { useEffect, useState } from 'react';
import axios from 'axios';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import CoffeeOutlinedIcon from '@mui/icons-material/CoffeeOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminDashboard.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/admin/dashboard-stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) {
    return (
      <AdminLayout title="Dashboard">
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <h1 className="admin-dashboard-heading">Dashboard</h1>
        <p className="admin-dashboard-subheading">
          Welcome to the World in a Cup admin panel. Manage your coffee shop content here.
        </p>

        <div className="admin-stats-grid admin-stats-grid-top">
          <div className="admin-stat-card small">
            <div className="admin-stat-card-header">
              <span>Total Menu Items</span>
              <AppsOutlinedIcon />
            </div>
            <h2>{stats.totalItems}</h2>
            <p>Across all categories</p>
          </div>

          <div className="admin-stat-card small">
            <div className="admin-stat-card-header">
              <span>Hot Drinks</span>
              <CoffeeOutlinedIcon />
            </div>
            <h2>{stats.hotDrinks}</h2>
            <p>Traditional hot beverages</p>
          </div>

          <div className="admin-stat-card small">
            <div className="admin-stat-card-header">
              <span>Cold Drinks</span>
              <AcUnitOutlinedIcon />
            </div>
            <h2>{stats.coldDrinks}</h2>
            <p>Refreshing cold beverages</p>
          </div>

          <div className="admin-stat-card small">
            <div className="admin-stat-card-header">
              <span>Desserts</span>
              <CakeOutlinedIcon />
            </div>
            <h2>{stats.desserts}</h2>
            <p>Sweet treats</p>
          </div>
        </div>

        <div className="admin-stats-grid admin-stats-grid-bottom">
          <div className="admin-stat-card large">
            <div className="admin-stat-card-header">
              <span className="admin-stat-title-with-icon">
                <PublicOutlinedIcon />
                Countries
              </span>
            </div>
            <h2>{stats.countries}</h2>
            <p>Featuring coffee traditions from around the world</p>
          </div>

          <div className="admin-stat-card large">
            <div className="admin-stat-card-header">
              <span className="admin-stat-title-with-icon">
                <LocalOfferOutlinedIcon />
                Tags
              </span>
            </div>
            <h2>{stats.tags}</h2>
            <p>Tags for filtering menu items</p>
          </div>

          <div className="admin-stat-card large">
            <div className="admin-stat-card-header">
              <span className="admin-stat-title-with-icon">
                <HomeOutlinedIcon />
                Home Stats
              </span>
            </div>

            <div className="admin-home-stats">
              <div>
                <h2>{stats.homeStats.stat_1_number}</h2>
                <p>{stats.homeStats.stat_1_label}</p>
              </div>
              <div>
                <h2>{stats.homeStats.stat_2_number}</h2>
                <p>{stats.homeStats.stat_2_label}</p>
              </div>
              <div>
                <h2>{stats.homeStats.stat_3_number}</h2>
                <p>{stats.homeStats.stat_3_label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;