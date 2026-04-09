const multer = require('multer');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const db = require('./db');

/* =========================
   CORS
========================= */
const allowedOrigins = [
  'https://coffee-menu-chi-tawny.vercel.app',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   MULTER
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* =========================
   TEST ROUTES
========================= */

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/test', (req, res) => {
  res.json({ message: "API works perfectly" });
});

/* =========================
   HERO SECTION ROUTES
========================= */

app.get('/api/hero', (req, res) => {
  db.query('SELECT * FROM hero_section LIMIT 1', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0]);
  });
});

app.put('/api/hero', upload.single('image'), (req, res) => {
  const {
    est_text,
    title,
    description,
    primary_button_text,
    primary_button_link,
    secondary_button_text,
    secondary_button_link,
    stat_1_number,
    stat_1_label,
    stat_2_number,
    stat_2_label,
    stat_3_number,
    stat_3_label
  } = req.body;

  const image = req.file ? req.file.filename : req.body.image;

  const sql = `
    UPDATE hero_section SET
      est_text = ?,
      title = ?,
      description = ?,
      primary_button_text = ?,
      primary_button_link = ?,
      secondary_button_text = ?,
      secondary_button_link = ?,
      image = ?,
      stat_1_number = ?,
      stat_1_label = ?,
      stat_2_number = ?,
      stat_2_label = ?,
      stat_3_number = ?,
      stat_3_label = ?
    WHERE id = 1
  `;

  db.query(
    sql,
    [
      est_text,
      title,
      description,
      primary_button_text,
      primary_button_link,
      secondary_button_text,
      secondary_button_link,
      image,
      stat_1_number,
      stat_1_label,
      stat_2_number,
      stat_2_label,
      stat_3_number,
      stat_3_label
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Hero updated successfully' });
    }
  );
});

/* =========================
   CATEGORIES ROUTES
========================= */

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY display_order ASC', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

/* =========================
   REGIONS ROUTES
========================= */

app.get('/api/regions', (req, res) => {
  db.query('SELECT * FROM regions ORDER BY display_order ASC', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.post('/api/regions', (req, res) => {
  const { name, display_order } = req.body;

  const sql = 'INSERT INTO regions (name, display_order) VALUES (?, ?)';
  db.query(sql, [name, display_order || 0], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Region added successfully',
      id: result.insertId
    });
  });
});

app.put('/api/regions/:id', (req, res) => {
  const { id } = req.params;
  const { name, display_order } = req.body;

  const sql = 'UPDATE regions SET name = ?, display_order = ? WHERE id = ?';
  db.query(sql, [name, display_order || 0, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Region updated successfully' });
  });
});

app.delete('/api/regions/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM regions WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Region deleted successfully' });
  });
});

app.get('/api/filterbar', (req, res) => {
  db.query('SELECT * FROM filterbar_section LIMIT 1', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

app.put('/api/filterbar', (req, res) => {
  const { subtitle, title, description, search_placeholder } = req.body;

  const sql = `
    UPDATE filterbar_section SET
      subtitle = ?,
      title = ?,
      description = ?,
      search_placeholder = ?
    WHERE id = 1
  `;

  db.query(
    sql,
    [subtitle, title, description, search_placeholder],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Filter bar updated successfully' });
    }
  );
});

/* =========================
   MENU ITEMS ROUTES
========================= */

app.get('/api/menu-items', (req, res) => {
  const sql = `
    SELECT 
      menu_items.*,
      categories.name AS category_name,
      regions.name AS region_name
    FROM menu_items
    JOIN categories ON menu_items.category_id = categories.id
    JOIN regions ON menu_items.region_id = regions.id
    ORDER BY menu_items.id DESC
  `;

  db.query(sql, (err, items) => {
    if (err) return res.status(500).json({ error: err.message });

    if (items.length === 0) {
      return res.json([]);
    }

    const itemIds = items.map((item) => item.id);

    const tagSql = `
      SELECT menu_item_id, tag_name
      FROM menu_item_tags
      WHERE menu_item_id IN (?)
    `;

    db.query(tagSql, [itemIds], (tagErr, tags) => {
      if (tagErr) return res.status(500).json({ error: tagErr.message });

      const itemsWithTags = items.map((item) => {
        const itemTags = tags
          .filter((tag) => tag.menu_item_id === item.id)
          .map((tag) => tag.tag_name);

        return {
          ...item,
          tags: itemTags
        };
      });

      res.json(itemsWithTags);
    });
  });
});

app.get('/api/menu-items/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM menu_items WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

app.post('/api/menu-items', upload.single('image'), (req, res) => {
  const {
    name,
    category_id,
    region_id,
    country,
    price,
    description,
    badge
  } = req.body;

  const image = req.file ? req.file.filename : '';

  const sql = `
    INSERT INTO menu_items 
    (name, category_id, region_id, country, price, image, description, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, category_id, region_id, country, price, image, description, badge],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item added successfully', id: result.insertId });
    }
  );
});

app.put('/api/menu-items/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;

  const {
    name,
    category_id,
    region_id,
    country,
    price,
    description,
    badge
  } = req.body;

  const image = req.file ? req.file.filename : req.body.image;

  const sql = `
    UPDATE menu_items SET
      name = ?,
      category_id = ?,
      region_id = ?,
      country = ?,
      price = ?,
      image = ?,
      description = ?,
      badge = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, category_id, region_id, country, price, image, description, badge, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item updated successfully' });
    }
  );
});

app.delete('/api/menu-items/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM menu_items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted successfully' });
  });
});

/* =========================
   ABOUT ROUTES
========================= */

app.get('/api/about', (req, res) => {
  db.query('SELECT * FROM about_section LIMIT 1', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

app.put('/api/about', (req, res) => {
  const {
    subtitle,
    title,
    description,
    quote_text,
    quote_author
  } = req.body;

  const sql = `
    UPDATE about_section SET
      subtitle = ?,
      title = ?,
      description = ?,
      quote_text = ?,
      quote_author = ?
    WHERE id = 1
  `;

  db.query(
    sql,
    [subtitle, title, description, quote_text, quote_author],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'About section updated successfully' });
    }
  );
});

app.get('/api/about-cards', (req, res) => {
  db.query('SELECT * FROM about_cards ORDER BY display_order ASC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/api/about-cards', (req, res) => {
  const { icon, title, description, display_order } = req.body;

  const sql = `
    INSERT INTO about_cards (icon, title, description, display_order)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [icon, title, description, display_order || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'About card added successfully', id: result.insertId });
    }
  );
});

app.put('/api/about-cards/:id', (req, res) => {
  const { id } = req.params;
  const { icon, title, description, display_order } = req.body;

  const sql = `
    UPDATE about_cards SET
      icon = ?,
      title = ?,
      description = ?,
      display_order = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [icon, title, description, display_order || 0, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'About card updated successfully' });
    }
  );
});

app.delete('/api/about-cards/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM about_cards WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'About card deleted successfully' });
  });
});

/* =========================
   DASHBOARD + AUTH
========================= */

app.get('/api/admin/dashboard-stats', (req, res) => {
  const stats = {};

  const totalItemsSql = `SELECT COUNT(*) AS totalItems FROM menu_items`;
  const hotDrinksSql = `
    SELECT COUNT(*) AS hotDrinks
    FROM menu_items
    JOIN categories ON menu_items.category_id = categories.id
    WHERE categories.name = 'Hot Drinks'
  `;
  const coldDrinksSql = `
    SELECT COUNT(*) AS coldDrinks
    FROM menu_items
    JOIN categories ON menu_items.category_id = categories.id
    WHERE categories.name = 'Cold Drinks'
  `;
  const dessertsSql = `
    SELECT COUNT(*) AS desserts
    FROM menu_items
    JOIN categories ON menu_items.category_id = categories.id
    WHERE categories.name = 'Desserts'
  `;
  const countriesSql = `SELECT COUNT(DISTINCT country) AS countries FROM menu_items`;
  const tagsSql = `SELECT COUNT(DISTINCT tag_name) AS tags FROM menu_item_tags`;
  const heroSql = `
    SELECT 
      stat_1_number, stat_1_label,
      stat_2_number, stat_2_label,
      stat_3_number, stat_3_label
    FROM hero_section
    LIMIT 1
  `;

  db.query(totalItemsSql, (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalItems = totalResult[0].totalItems;

    db.query(hotDrinksSql, (err, hotResult) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.hotDrinks = hotResult[0].hotDrinks;

      db.query(coldDrinksSql, (err, coldResult) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.coldDrinks = coldResult[0].coldDrinks;

        db.query(dessertsSql, (err, dessertResult) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.desserts = dessertResult[0].desserts;

          db.query(countriesSql, (err, countryResult) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.countries = countryResult[0].countries;

            db.query(tagsSql, (err, tagResult) => {
              if (err) return res.status(500).json({ error: err.message });
              stats.tags = tagResult[0].tags;

              db.query(heroSql, (err, heroResult) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.homeStats = heroResult[0];
                res.json(stats);
              });
            });
          });
        });
      });
    });
  });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Login successful' });
  }

  res.status(401).json({ success: false, message: 'Wrong password' });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});