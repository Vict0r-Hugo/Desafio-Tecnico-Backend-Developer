const express = require("express");
const router = express.Router();

router.post("/inventory", (req, res) => {
  try {
    console.log("Mock Protheus recebeu:", req.body);

    return res.status(200).json({
      message: "Estoque atualizado no Protheus (mock)"
    });

  } catch (error) {
    console.error("Erro no mock Protheus:", error.message);

    return res.status(500).json({
      error: "Erro interno no Protheus"
    });
  }
});

module.exports = router;