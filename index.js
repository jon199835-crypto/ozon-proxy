const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Proxy работает ✅");
});

app.get("/product/:sku", (req, res) => {
  res.json({ test: "ok", sku: req.params.sku });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
