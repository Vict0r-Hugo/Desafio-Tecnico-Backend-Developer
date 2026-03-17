const express = require("express");
const db = require("../database/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

const SECRET = "secretkey";

router.post("/login", (req, res) => {

  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user) => {

      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });

    }
  );

});

module.exports = router;