import { useEffect, useState } from 'react';
import axios from 'axios';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AdminLayout from '../components/AdminLayout';
import '../styles/FilterBarAdmin.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FilterBarAdmin() {
  const [regions, setRegions] = useState([]);
  const [showMenuId, setShowMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    display_order: ''
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = () => {
    axios
      .get(`${API_BASE}/api/regions`)
      .then((res) => setRegions(res.data))
      .catch((err) => console.log('Error fetching regions:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRegion = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/api/regions`, {
        name: formData.name,
        display_order: formData.display_order || 0
      });

      setShowAddModal(false);
      setFormData({ name: '', display_order: '' });
      fetchRegions();
    } catch (err) {
      console.log('Error adding region:', err);
    }
  };

  const openEditModal = (region) => {
    setSelectedRegion(region);
    setFormData({
      name: region.name,
      display_order: region.display_order
    });
    setShowEditModal(true);
    setShowMenuId(null);
  };

  const handleEditRegion = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE}/api/regions/${selectedRegion.id}`, {
        name: formData.name,
        display_order: formData.display_order || 0
      });

      setShowEditModal(false);
      setSelectedRegion(null);
      setFormData({ name: '', display_order: '' });
      fetchRegions();
    } catch (err) {
      console.log('Error updating region:', err);
    }
  };

  const handleDeleteRegion = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/regions/${id}`);
      setShowMenuId(null);
      fetchRegions();
    } catch (err) {
      console.log('Error deleting region:', err);
    }
  };

  return (
    <AdminLayout title="Filter Bar">
      <div className="filterbar-admin-page">
        <div className="filterbar-admin-header">
          <div>
            <h1 className="filterbar-admin-title"><b>Regions</b></h1>
            <p className="filterbar-admin-subtitle">
              Manage the regions shown in the filter bar on the website.
            </p>
          </div>

          <button
            className="filterbar-add-btn"
            onClick={() => {
              setFormData({ name: '', display_order: '' });
              setShowAddModal(true);
            }}
          >
            <AddOutlinedIcon />
            Add Region
          </button>
        </div>

        <div className="filterbar-admin-table-wrapper">
          <table className="filterbar-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Display Order</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {regions.map((region) => (
                <tr key={region.id}>
                  <td>{region.name}</td>
                  <td>{region.display_order}</td>

                  <td className="filterbar-admin-action-cell">
                    <button
                      className="filterbar-admin-action-btn"
                      onClick={() =>
                        setShowMenuId(showMenuId === region.id ? null : region.id)
                      }
                    >
                      <MoreVertOutlinedIcon />
                    </button>

                    {showMenuId === region.id && (
                      <div className="filterbar-admin-dropdown">
                        <button onClick={() => openEditModal(region)}>Update</button>
                        <button onClick={() => handleDeleteRegion(region.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div
            className="filterbar-admin-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="filterbar-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add Region</h2>

              <form onSubmit={handleAddRegion} className="filterbar-admin-form">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Region Name"
                  required
                />

                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="Display Order"
                />

                <div className="filterbar-admin-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    Add Region
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="filterbar-admin-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="filterbar-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Update Region</h2>

              <form onSubmit={handleEditRegion} className="filterbar-admin-form">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Region Name"
                  required
                />

                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="Display Order"
                />

                <div className="filterbar-admin-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default FilterBarAdmin;