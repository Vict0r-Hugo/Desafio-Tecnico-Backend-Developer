const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./inventory.db");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      sku TEXT PRIMARY KEY,
      warehouse_id TEXT,
      stock INTEGER,
      min_stock INTEGER
    )
  `);

});

module.exports = db;