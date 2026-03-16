const db = require("../database/db");
const { notifyProtheus } = require("./protheusService");

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
        SET stock = stock + ?
        WHERE sku = ? AND warehouse_id = ?
        `,
        [move.change, move.sku, warehouse_id],
        function (err) {

          if (err) reject(err);
          else resolve();
        }
      );

    });

  }

  await notifyProtheus(payload);

}

function getLowStock(limit) {

  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT sku, stock
      FROM products
      WHERE stock < min_stock
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
  getLowStock
};