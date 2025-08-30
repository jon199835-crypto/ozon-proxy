const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// тестовый маршрут
app.get("/", (req, res) => {
  res.send("Ozon Proxy Server is running ✅. Используй /product/:sku");
});

// маршрут для SKU
app.get("/product/:sku", async (req, res) => {
  const sku = req.params.sku;
  const url = `https://www.ozon.ru/product/${sku}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept": "text/html"
      }
    });

    const html = response.data;

    // Ищем JSON в <script id="state">
    const match = html.match(
      /<script id="state" type="application\/json">(.*?)<\/script>/s
    );

    if (!match) {
      return res.json({ error: "Ozon вернул заглушку или капчу" });
    }

    const state = JSON.parse(match[1]);

    // Пробуем достать блок с карточкой
    const product = state?.pdp?.webProductDetail?.productCard || {};

    const data = {
      sku,
      title: product.title || "нет данных",
      price: product.price?.currentPrice || "нет данных",
      rating: product.rating || "нет данных",
      reviews: product.reviewsCount || "нет данных",
      available: product.availability?.available ? "в наличии" : "нет в наличии"
    };

    res.json(data);
  } catch (e) {
    console.error("Ошибка при запросе:", e.message);
    res.json({ error: "Ошибка запроса", details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
