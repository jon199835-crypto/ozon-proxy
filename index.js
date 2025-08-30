const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// тестовый корень
app.get("/", (req, res) => {
  res.send("Ozon Proxy работает ✅. Используй /product/:sku");
});

// маршрут для SKU
app.get("/product/:sku", async (req, res) => {
  const sku = req.params.sku;
  const apiUrl = `https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/product/${sku}/`;

  try {
    const response = await axios.get(apiUrl, {
      proxy: {
        host: "84.53.245.42",  // 🔹 сюда вставь IP бесплатного прокси
        port: 41258           // 🔹 сюда вставь порт
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      timeout: 15000
    });

    if (!response.data || typeof response.data !== "object") {
      return res.json({ error: "Не получили JSON" });
    }

    let widgetStates = {};
    try {
      widgetStates = JSON.parse(response.data.widgetStates || "{}");
    } catch {
      return res.json({ error: "Ошибка парсинга widgetStates" });
    }

    const productCard = widgetStates["webProductHeading"] || {};
    const priceBlock = widgetStates["webPrice"] || {};
    const reviewBlock = widgetStates["webProductReviews"] || {};
    const stockBlock = widgetStates["webStock"] || {};

    const data = {
      sku,
      title: productCard?.title || "нет данных",
      price: priceBlock?.price || "нет данных",
      rating: reviewBlock?.rating || "нет данных",
      reviews: reviewBlock?.reviewCount || "нет данных",
      available: stockBlock?.isAvailable ? "в наличии" : "нет в наличии"
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
