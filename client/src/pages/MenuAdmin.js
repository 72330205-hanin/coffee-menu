import { useEffect, useState } from 'react';
import axios from 'axios';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AdminLayout from '../components/AdminLayout';
import '../styles/MenuAdmin.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [showMenuId, setShowMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    region_id: '',
    country: '',
    price: '',
    image: '',
    description: '',
    badge: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchRegions();
  }, []);

  const fetchMenuItems = () => {
    axios
      .get(`${API_BASE}/api/menu-items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log('Error fetching menu items:', err));
  };

  const fetchCategories = () => {
    axios
      .get(`${API_BASE}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log('Error fetching categories:', err));
  };

  const fetchRegions = () => {
    axios
      .get(`${API_BASE}/api/regions`)
      .then((res) => setRegions(res.data))
      .catch((err) => console.log('Error fetching regions:', err));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) {
      setFormData((prev) => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      region_id: '',
      country: '',
      price: '',
      image: '',
      description: '',
      badge: ''
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      for (let key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.post(`${API_BASE}/api/menu-items`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowAddModal(false);
      resetForm();
      fetchMenuItems();
    } catch (err) {
      console.log('Error adding item:', err);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category_id: item.category_id,
      region_id: item.region_id,
      country: item.country,
      price: item.price,
      image: item.image,
      description: item.description,
      badge: item.badge || ''
    });
    setShowEditModal(true);
    setShowMenuId(null);
  };

  const handleEditItem = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      for (let key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.put(`${API_BASE}/api/menu-items/${selectedItem.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      fetchMenuItems();
    } catch (err) {
      console.log('Error updating item:', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/menu-items/${id}`);
      setShowMenuId(null);
      fetchMenuItems();
    } catch (err) {
      console.log('Error deleting item:', err);
    }
  };

  return (
    <AdminLayout title="Menu">
      <div className="menu-admin-page">
        <div className="menu-admin-header">
          <div>
            <h1 className="menu-admin-title"><b>Menu Items</b></h1>
            <p className="menu-admin-subtitle">
              Manage hot drinks, cold drinks, and desserts shown on the website.
            </p>
          </div>

          <button
            className="menu-add-btn"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <AddOutlinedIcon />
            Add Item
          </button>
        </div>

        <div className="menu-admin-table-wrapper">
          <table className="menu-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Region</th>
                <th>Country</th>
                <th>Price</th>
                <th>Description</th>
                <th>Badge</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.image}</td>
                  <td>{item.name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.region_name}</td>
                  <td>{item.country}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td title={item.description}>{item.description}</td>
                  <td>{item.badge || '-'}</td>

                  <td className="menu-admin-action-cell">
                    <button
                      className="menu-admin-action-btn"
                      onClick={() =>
                        setShowMenuId(showMenuId === item.id ? null : item.id)
                      }
                    >
                      <MoreVertOutlinedIcon />
                    </button>

                    {showMenuId === item.id && (
                      <div className="menu-admin-dropdown">
                        <button onClick={() => openEditModal(item)}>Update</button>
                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
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
            className="menu-admin-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="menu-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add Menu Item</h2>

              <form onSubmit={handleAddItem} className="menu-admin-form">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Item Name"
                  required
                />

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  name="region_id"
                  value={formData.region_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                />

                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="4"
                  required
                />

                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="Badge (Popular / New)"
                />

                <div className="menu-admin-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="menu-admin-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="menu-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Update Menu Item</h2>

              <form onSubmit={handleEditItem} className="menu-admin-form">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Item Name"
                  required
                />

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  name="region_id"
                  value={formData.region_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                />

                <div className="custom-file-input">
                  <span className="file-name">
                    {formData.image && typeof formData.image === 'object'
                      ? formData.image.name
                      : selectedItem.image}
                  </span>

                  <label className="file-label">
                    Choose File
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      hidden
                    />
                  </label>
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="4"
                  required
                />

                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="Badge (Popular / New)"
                />

                <div className="menu-admin-form-actions">
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

export default MenuAdmin;