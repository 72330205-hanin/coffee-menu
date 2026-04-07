import { useEffect, useState } from 'react';
import axios from 'axios';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AdminLayout from '../components/AdminLayout';
import '../styles/AboutAdmin.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AboutAdmin() {
  const [cards, setCards] = useState([]);
  const [showMenuId, setShowMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    display_order: ''
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    axios
      .get(`${API_BASE}/api/about-cards`)
      .then((res) => setCards(res.data))
      .catch((err) => console.log('Error fetching about cards:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/api/about-cards`, {
        icon: formData.icon,
        title: formData.title,
        description: formData.description,
        display_order: formData.display_order || 0
      });

      setShowAddModal(false);
      setFormData({
        icon: '',
        title: '',
        description: '',
        display_order: ''
      });
      fetchCards();
    } catch (err) {
      console.log('Error adding card:', err);
    }
  };

  const openEditModal = (card) => {
    setSelectedCard(card);
    setFormData({
      icon: card.icon,
      title: card.title,
      description: card.description,
      display_order: card.display_order
    });
    setShowEditModal(true);
    setShowMenuId(null);
  };

  const handleEditCard = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE}/api/about-cards/${selectedCard.id}`, {
        icon: formData.icon,
        title: formData.title,
        description: formData.description,
        display_order: formData.display_order || 0
      });

      setShowEditModal(false);
      setSelectedCard(null);
      setFormData({
        icon: '',
        title: '',
        description: '',
        display_order: ''
      });
      fetchCards();
    } catch (err) {
      console.log('Error updating card:', err);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/about-cards/${id}`);
      setShowMenuId(null);
      fetchCards();
    } catch (err) {
      console.log('Error deleting card:', err);
    }
  };

  return (
    <AdminLayout title="About Section">
      <div className="about-admin-page">
        <div className="about-admin-header">
          <div>
            <h1 className="about-admin-title"><b>About Cards</b></h1>
            <p className="about-admin-subtitle">
              Manage the cards shown in the about section on the website.
            </p>
          </div>

          <button
            className="about-add-btn"
            onClick={() => {
              setFormData({
                icon: '',
                title: '',
                description: '',
                display_order: ''
              });
              setShowAddModal(true);
            }}
          >
            <AddOutlinedIcon />
            Add Card
          </button>
        </div>

        <div className="about-admin-table-wrapper">
          <table className="about-admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cards.map((card) => (
                <tr key={card.id}>
                  <td>{card.icon}</td>
                  <td>{card.title}</td>
                  <td title={card.description}>{card.description}</td>
                  <td>{card.display_order}</td>

                  <td className="about-admin-action-cell">
                    <button
                      className="about-admin-action-btn"
                      onClick={() =>
                        setShowMenuId(showMenuId === card.id ? null : card.id)
                      }
                    >
                      <MoreVertOutlinedIcon />
                    </button>

                    {showMenuId === card.id && (
                      <div className="about-admin-dropdown">
                        <button onClick={() => openEditModal(card)}>Update</button>
                        <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
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
            className="about-admin-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="about-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add Card</h2>

              <form onSubmit={handleAddCard} className="about-admin-form">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Icon name (public, diamond, heart, leaf)"
                  required
                />

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Card Title"
                  required
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Card Description"
                  rows="4"
                  required
                />

                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="Display Order"
                />

                <div className="about-admin-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="about-admin-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="about-admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Update Card</h2>

              <form onSubmit={handleEditCard} className="about-admin-form">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Icon name (public, diamond, heart, leaf)"
                  required
                />

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Card Title"
                  required
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Card Description"
                  rows="4"
                  required
                />

                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="Display Order"
                />

                <div className="about-admin-form-actions">
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

export default AboutAdmin;