import MenuCard from './MenuCard';
import '../styles/MenuSection.css';

function MenuSection({ id, title, subtitle, itemCount, items, icon }) {
  if (items.length === 0) return null;

  return (
    <section className="menu-section" id={id}>
      <div className="container">
        <div className="menu-section-header">
          <div className="menu-section-left">
            <div className="menu-section-icon">{icon}</div>

            <div className="menu-section-heading">
              <div className="menu-section-title-row">
                <h2>{title}</h2>
                <span className="menu-section-line"></span>
              </div>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="menu-section-count">
            {itemCount} items
          </div>
        </div>

        <div className="menu-section-grid">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MenuSection;