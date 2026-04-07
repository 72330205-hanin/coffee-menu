import { useEffect, useState } from 'react';
import axios from 'axios';
import PublicIcon from '@mui/icons-material/Public';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SpaIcon from '@mui/icons-material/Spa';
import '../styles/About.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/about`)
      .then((res) => setAboutData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${API_BASE}/api/about-cards`)
      .then((res) => setFeatures(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'public':
        return <PublicIcon />;
      case 'diamond':
        return <DiamondOutlinedIcon />;
      case 'heart':
        return <FavoriteBorderIcon />;
      case 'leaf':
        return <SpaIcon />;
      default:
        return <PublicIcon />;
    }
  };

  if (!aboutData) {
    return <p>Loading...</p>;
  }

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-header">
          <div className="about-subtitle-wrapper">
            <span className="about-line"></span>
            <span className="about-subtitle">{aboutData.subtitle}</span>
            <span className="about-line"></span>
          </div>

          <h2 className="about-title">{aboutData.title}</h2>

          <p className="about-description">{aboutData.description}</p>
        </div>

        <div className="about-cards">
          {features.map((item) => (
            <div className="about-card" key={item.id}>
              <div className="about-card-icon">{getIcon(item.icon)}</div>
              <h3 className="about-card-title">{item.title}</h3>
              <p className="about-card-text">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="about-quote">
          <p className="about-quote-text">{aboutData.quote_text}</p>
          <span className="about-quote-author">
            — {aboutData.quote_author}
          </span>
        </div>
      </div>
    </section>
  );
}

export default About;