const express = require("express");

const inventoryRoutes = require("./routes/inventory");

const app = express();

app.use(express.json());

app.use(inventoryRoutes);

app.listen(3000, () => {
  console.log("Inventory service running on port 3000");
});