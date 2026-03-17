const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

const {
  syncInventory,
  getLowStock, 
  getAllProducts
} = require("../services/inventoryService");

router.patch("/v1/inventory/sync",authenticateToken, async (req, res) => {

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

router.get("/v1/products/low-stock",authenticateToken, async (req, res) => {

  try {

    const products = await getLowStock(req.query.limit);

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

router.get("/v1/products/", authenticateToken, async (req, res) => {

  try {

    const products = await getAllProducts(req.query.limit);

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;