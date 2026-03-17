const express = require("express");
const router = express.Router();

router.post("/inventory", (req, res) => {

  const random = Math.random();

  console.log("Mock Protheus recebeu:", req.body);

  // simular erro aleatório
  if (random < 0.3) {
    console.log("Erro simulado no Protheus");
    return res.status(500).json({ error: "Erro interno Protheus" });
  }

  res.json({ message: "OK Protheus" });
});

module.exports = router;