const express = require("express");
const router = express.Router();

const {
  syncInventory,
  getLowStock
} = require("../services/inventoryService");

router.patch("/v1/inventory/sync", async (req, res) => {

  try {

    await syncInventory(req.body);

    res.json({
      message: "Inventory updated"
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

});

router.get("/v1/products/low-stock", async (req, res) => {

  try {

    const products = await getLowStock(req.query.limit);

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;