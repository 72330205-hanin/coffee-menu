import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import MenuSection from './components/MenuSection';
import About from './components/About';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HomeSectionAdmin from './pages/HomeSectionAdmin';
import FilterBarAdmin from './pages/FilterBarAdmin';
import AboutAdmin from './pages/AboutAdmin';
import MenuAdmin from './pages/MenuAdmin';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CakeIcon from '@mui/icons-material/Cake';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [activeRegion, setActiveRegion] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/menu-items`)
      .then((response) => {
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.log('Error fetching menu items:', error);
      });
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesRegion =
      activeRegion === 'All' || item.region_name === activeRegion;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.country.toLowerCase().includes(search) ||
      item.category_name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      (item.tags && item.tags.join(' ').toLowerCase().includes(search));

    return matchesRegion && matchesSearch;
  });

  const hotDrinks = filteredItems.filter(
    (item) => item.category_name === 'Hot Drinks'
  );
  const coldDrinks = filteredItems.filter(
    (item) => item.category_name === 'Cold Drinks'
  );
  const desserts = filteredItems.filter(
    (item) => item.category_name === 'Desserts'
  );

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <FilterBar
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <MenuSection
                id="hot-drinks"
                title="Hot Drinks"
                subtitle="Traditional warm beverages from around the world"
                itemCount={hotDrinks.length}
                items={hotDrinks}
                icon={<LocalCafeIcon />}
              />
              <MenuSection
                id="cold-drinks"
                title="Cold Drinks"
                subtitle="Refreshing iced coffees and cold brews"
                itemCount={coldDrinks.length}
                items={coldDrinks}
                icon={<AcUnitIcon />}
              />
              <MenuSection
                id="desserts"
                title="Desserts"
                subtitle="Sweet treats and coffee-infused delights"
                itemCount={desserts.length}
                items={desserts}
                icon={<CakeIcon />}
              />
              <About />
            </>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/home-section" element={<HomeSectionAdmin />} />
        <Route path="/admin/filter-bar" element={<FilterBarAdmin />} />
        <Route path="/admin/about" element={<AboutAdmin />} />
        <Route path="/admin/menu" element={<MenuAdmin />} />

        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Hero />
              <FilterBar
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <MenuSection
                id="hot-drinks"
                title="Hot Drinks"
                subtitle="Traditional warm beverages from around the world"
                itemCount={hotDrinks.length}
                items={hotDrinks}
                icon={<LocalCafeIcon />}
              />
              <MenuSection
                id="cold-drinks"
                title="Cold Drinks"
                subtitle="Refreshing iced coffees and cold brews"
                itemCount={coldDrinks.length}
                items={coldDrinks}
                icon={<AcUnitIcon />}
              />
              <MenuSection
                id="desserts"
                title="Desserts"
                subtitle="Sweet treats and coffee-infused delights"
                itemCount={desserts.length}
                items={desserts}
                icon={<CakeIcon />}
              />
              <About />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;