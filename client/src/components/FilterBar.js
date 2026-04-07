import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FilterBar.css';

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FilterBar({ activeRegion, setActiveRegion, searchTerm, setSearchTerm }) {
  const [filterData, setFilterData] = useState(null);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/filterbar`)
      .then((res) => setFilterData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${API_BASE}/api/regions`)
      .then((res) => setRegions(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!filterData) {
    return <p>Loading...</p>;
  }

  return (
    <section className="filter-section" id="menu">
      <div className="container">
        <div className="filter-header">
          <div className="filter-subtitle-wrapper">
            <span className="filter-line"></span>
            <span className="filter-subtitle">{filterData.subtitle}</span>
            <span className="filter-line"></span>
          </div>

          <h2 className="filter-title">{filterData.title}</h2>

          <p className="filter-description">{filterData.description}</p>

          <div className="filter-search-box">
            <input
              type="text"
              placeholder={filterData.search_placeholder}
              className="filter-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {regions.map((region) => (
              <button
                key={region.id}
                className={`filter-btn ${activeRegion === region.name ? 'active' : ''}`}
                onClick={() => setActiveRegion(region.name)}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FilterBar;