import { useEffect, useState } from 'react';
import axios from 'axios';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AdminLayout from '../components/AdminLayout';
import '../styles/HomeSectionAdmin.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function HomeSectionAdmin() {
  const [heroData, setHeroData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    est_text: '',
    title: '',
    description: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
    image: '',
    stat_1_number: '',
    stat_1_label: '',
    stat_2_number: '',
    stat_2_label: '',
    stat_3_number: '',
    stat_3_label: ''
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = () => {
    axios
      .get(`${API_BASE}/api/hero`)
      .then((res) => {
        setHeroData(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.log('Error fetching hero data:', err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      for (let key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.put(`${API_BASE}/api/hero`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowEditModal(false);
      setShowMenu(false);
      fetchHeroData();
    } catch (err) {
      console.log('Error updating hero section:', err);
    }
  };

  if (!heroData) {
    return (
      <AdminLayout title="Home Section">
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Home Section">
      <div className="home-admin-page">
        <h1 className="home-admin-title"><b>Home Section</b></h1>
        <p className="home-admin-subtitle">
          Manage the content of the hero section shown on the website.
        </p>

        <div className="home-admin-table-wrapper">
          <table className="home-admin-table">
            <thead>
              <tr>
                <th>EST</th>
                <th>Title</th>
                <th>Description</th>
                <th>Primary Button</th>
                <th>Secondary Button</th>
                <th>Image</th>
                <th>Stats</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{heroData.est_text}</td>
                <td>{heroData.title}</td>
                <td>{heroData.description}</td>
                <td>
                  {heroData.primary_button_text}
                  <br />
                  <span className="home-admin-link-text">
                    {heroData.primary_button_link}
                  </span>
                </td>
                <td>
                  {heroData.secondary_button_text}
                  <br />
                  <span className="home-admin-link-text">
                    {heroData.secondary_button_link}
                  </span>
                </td>
                <td>{heroData.image}</td>
                <td>
                  {heroData.stat_1_number} {heroData.stat_1_label}
                  <br />
                  {heroData.stat_2_number} {heroData.stat_2_label}
                  <br />
                  {heroData.stat_3_number} {heroData.stat_3_label}
                </td>

                <td className="home-admin-action-cell">
                  <button
                    className="home-admin-action-btn"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <MoreVertOutlinedIcon />
                  </button>

                  {showMenu && (
                    <div className="home-admin-dropdown">
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setShowMenu(false);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showEditModal && (
          <div
            className="home-admin-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="home-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Update Home Section</h2>

              <form onSubmit={handleUpdate} className="home-admin-form">
                <input
                  type="text"
                  name="est_text"
                  value={formData.est_text}
                  onChange={handleInputChange}
                  placeholder="EST Text"
                />

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="4"
                />

                <input
                  type="text"
                  name="primary_button_text"
                  value={formData.primary_button_text}
                  onChange={handleInputChange}
                  placeholder="Primary Button Text"
                />

                <input
                  type="text"
                  name="primary_button_link"
                  value={formData.primary_button_link}
                  onChange={handleInputChange}
                  placeholder="Primary Button Link"
                />

                <input
                  type="text"
                  name="secondary_button_text"
                  value={formData.secondary_button_text}
                  onChange={handleInputChange}
                  placeholder="Secondary Button Text"
                />

                <input
                  type="text"
                  name="secondary_button_link"
                  value={formData.secondary_button_link}
                  onChange={handleInputChange}
                  placeholder="Secondary Button Link"
                />

                <div className="custom-file-input">
                  <span className="file-name">
                    {formData.image && typeof formData.image === 'object'
                      ? formData.image.name
                      : heroData.image}
                  </span>

                  <label className="file-label">
                    Choose File
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.files[0]
                        }));
                      }}
                      hidden
                    />
                  </label>
                </div>

                <input
                  type="text"
                  name="stat_1_number"
                  value={formData.stat_1_number}
                  onChange={handleInputChange}
                  placeholder="Stat 1 Number"
                />

                <input
                  type="text"
                  name="stat_1_label"
                  value={formData.stat_1_label}
                  onChange={handleInputChange}
                  placeholder="Stat 1 Label"
                />

                <input
                  type="text"
                  name="stat_2_number"
                  value={formData.stat_2_number}
                  onChange={handleInputChange}
                  placeholder="Stat 2 Number"
                />

                <input
                  type="text"
                  name="stat_2_label"
                  value={formData.stat_2_label}
                  onChange={handleInputChange}
                  placeholder="Stat 2 Label"
                />

                <input
                  type="text"
                  name="stat_3_number"
                  value={formData.stat_3_number}
                  onChange={handleInputChange}
                  placeholder="Stat 3 Number"
                />

                <input
                  type="text"
                  name="stat_3_label"
                  value={formData.stat_3_label}
                  onChange={handleInputChange}
                  placeholder="Stat 3 Label"
                />

                <div className="home-admin-form-actions">
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

export default HomeSectionAdmin;