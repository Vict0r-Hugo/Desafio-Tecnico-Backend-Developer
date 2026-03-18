const db = require("../database/db");
const { protheusService } = require("./protheusService");

async function syncInventory(payload) {

  const { warehouse_id, movements } = payload;

  if (!warehouse_id || !Array.isArray(movements)) {
    throw new Error("Invalid payload");
  }

  for (const move of movements) {

    if (!move.sku || typeof move.change !== "number") {
      throw new Error("Invalid movement data");
    }

    await new Promise((resolve, reject) => {

      db.run(
        `
        UPDATE products
        SET 
          stock = stock + ?,
          is_low_stock = CASE 
            WHEN stock + ? < min_stock THEN 1 
            ELSE 0 
          END
        WHERE sku = ? AND warehouse_id = ?
        `,
        [move.change, move.change, move.sku, warehouse_id],
        function (err) {

          if (err) reject(err);
          else resolve();

        }
      );

    });

  }

  await protheusService(payload);

}

function getLowStock() {

  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT sku, stock
      FROM products
      WHERE is_low_stock = 1
      `,
      [],
      (err, rows) => {

        if (err) reject(err);
        else resolve(rows);

      }
    );

  });

}

function getAllProducts(limit) {

  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT sku, stock
      FROM products
      LIMIT ?
      `,
      [limit || 50],
      (err, rows) => {

        if (err) reject(err);
        else resolve(rows);

      }
    );

  });

}

module.exports = {
  syncInventory,
  getLowStock, 
  getAllProducts
};