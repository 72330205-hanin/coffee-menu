import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
    setClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (clickCount === 3) {
      navigate(`/admin/login`);
      setClickCount(0);
      return;
    }

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1500);

    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  return (
    <nav className="custom-navbar">
      <div className="container">
        <div className="navbar-wrapper">

          <div className="logo-box" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="logo-img" />
            <div className="logo-text">
              <h4>World in a Cup</h4>
              <p>INTERNATIONAL COFFEE</p>
            </div>
          </div>

          <ul className="nav-links desktop-links">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#hot-drinks">Hot Drinks</a></li>
            <li><a href="#cold-drinks">Cold Drinks</a></li>
            <li><a href="#desserts">Desserts</a></li>
            <li><a href="#about">About</a></li>
          </ul>

          <a href="#menu" className="view-menu-btn">
            VIEW MENU
          </a>

          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
          <ul>
            <li><a href="#menu" onClick={closeMenu}>Menu</a></li>
            <li><a href="#hot-drinks" onClick={closeMenu}>Hot Drinks</a></li>
            <li><a href="#cold-drinks" onClick={closeMenu}>Cold Drinks</a></li>
            <li><a href="#desserts" onClick={closeMenu}>Desserts</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
          </ul>

          <a href="#menu" className="mobile-btn" onClick={closeMenu}>
            VIEW MENU
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;