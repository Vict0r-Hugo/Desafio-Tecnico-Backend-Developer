const sqlite3 = require("sqlite3").verbose();

const protheusDb = new sqlite3.Database("./protheus.db");

module.exports = protheusDb;