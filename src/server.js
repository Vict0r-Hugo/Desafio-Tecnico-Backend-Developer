const express = require("express");

const inventoryRoutes = require("./routes/inventory");
const authRoutes = require("./routes/auth");
const protheusMockRoutes = require("./routes/protheusMock");

const app = express();

app.use(express.json());

app.use(inventoryRoutes);

app.use("/mock/protheus", protheusMockRoutes);

app.use(authRoutes);

app.listen(3000, () => {
  console.log("Inventory service running on port 3000");
});