const axios = require("axios");
const retry = require("../utils/retry");
const protheusDb = require("../database/protheusDb");

function validateProductInProtheus(sku) {
  return new Promise((resolve, reject) => {

    protheusDb.get(
      "SELECT * FROM SB1 WHERE B1_COD = ?",
      [sku],
      (err, row) => {

        if (err) reject(err);
        else resolve(row);

      }
    );

  });
}

function getStock(sku) {
  return new Promise((resolve, reject) => {

    protheusDb.get(
      "SELECT * FROM SB2 WHERE B2_COD = ? AND B2_LOCAL = 'A1'",
      [sku],
      (err, row) => {

        if (err) reject(err);
        else resolve(row);

      }
    );

  });
}

function updateStock(sku, change) {
  return new Promise((resolve, reject) => {

    protheusDb.run(
      `
      UPDATE SB2
      SET B2_QATU = B2_QATU + ?
      WHERE B2_COD = ? AND B2_LOCAL = 'A1'
      `,
      [change, sku],
      function (err) {

        if (err) reject(err);
        else resolve();

      }
    );

  });
}

async function notifyProtheus(data) {
  console.log("iniciando integração com Protheus");

  for (const move of data.movements) {

    const product = await validateProductInProtheus(move.sku);

    if (!product) {
      throw new Error(`Produto ${move.sku} não existe no Protheus`);
    }

    const stock = await getStock(move.sku);
    console.log("estoque atual:", stock);

    if (!stock) {
      throw new Error(`Produto ${move.sku} sem saldo no Protheus`);
    }

    await updateStock(move.sku, move.change);
    console.log("estoque atualizado:", move.sku);
  }

  return retry(async () => {
    console.log("chamando API mock...");
    const response = await axios.post(
      "http://localhost:3000/mock/protheus/inventory",
      data
    );

    if (response.status >= 500) {
      throw new Error("Protheus error");
    }

    return response.data;

  }, 3);

}

module.exports = { notifyProtheus };