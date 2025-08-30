const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Ozon Proxy Server is running ✅. Используй /product/:sku");
});

app.get("/product/:sku", (req, res) => {
  const sku = req.params.sku;
  res.json({ message: "Работает!", sku: sku });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
