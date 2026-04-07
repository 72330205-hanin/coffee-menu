import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../styles/MenuCard.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function MenuCard({ item }) {
  const [showImage, setShowImage] = useState(false);
  const imageUrl = `${API_BASE}/uploads/${item.image}`;

  return (
    <>
      <div className="menu-card">
        <div className="menu-card-image-wrapper">
          {item.badge && (
            <span
              className={`menu-card-badge ${
                item.badge === 'Popular' ? 'popular' : 'new'
              }`}
            >
              {item.badge === 'Popular' ? '☆ Popular' : '✧ New'}
            </span>
          )}

          <img
            src={imageUrl}
            alt={item.name}
            className="menu-card-image"
            onClick={() => setShowImage(true)}
          />

          <span className="menu-card-country desktop-location">
            <LocationOnIcon className="location-icon" />
            {item.country}
          </span>
        </div>

        <div className="menu-card-body">
          <div className="menu-card-top">
            <h3 className="menu-card-title">{item.name}</h3>
            <span className="menu-card-price">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          <p className="menu-card-description">{item.description}</p>

          <span className="menu-card-country mobile-location">
            <LocationOnIcon className="location-icon" />
            {item.country}
          </span>

          <div className="menu-card-tags">
            {(item.tags || []).map((tag, index) => (
              <span key={index} className="menu-card-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showImage && (
        <div className="image-modal" onClick={() => setShowImage(false)}>
          <img
            src={imageUrl}
            alt={item.name}
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="image-modal-close"
            onClick={() => setShowImage(false)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default MenuCard;