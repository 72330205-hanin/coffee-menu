import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Hero.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Hero() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/hero`)
      .then((response) => {
        setHeroData(response.data);
      })
      .catch((error) => {
        console.log('Error fetching hero data:', error);
      });
  }, []);

  if (!heroData) {
    return <p>Loading...</p>;
  }

  const heroImageUrl = `${API_BASE}/uploads/${heroData.image}`;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-left">
            <div className="hero-est">
              <span className="hero-line"></span>
              <span className="hero-est-text">{heroData.est_text}</span>
            </div>

            <h1 className="hero-title">{heroData.title}</h1>

            <p className="hero-description">{heroData.description}</p>

            <div className="hero-buttons">
              <a href={heroData.primary_button_link} className="hero-btn-primary">
                {heroData.primary_button_text}
              </a>

              <a href={heroData.secondary_button_link} className="hero-btn-secondary">
                {heroData.secondary_button_text} →
              </a>
            </div>
          </div>

          <div className="hero-right">
            <img src={heroImageUrl} alt="Coffee" className="hero-image" />

            <div className="hero-stats">
              <div className="hero-stat-box">
                <h3>{heroData.stat_1_number}</h3>
                <p>{heroData.stat_1_label}</p>
              </div>

              <div className="hero-stat-box">
                <h3>{heroData.stat_2_number}</h3>
                <p>{heroData.stat_2_label}</p>
              </div>

              <div className="hero-stat-box">
                <h3>{heroData.stat_3_number}</h3>
                <p>{heroData.stat_3_label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;