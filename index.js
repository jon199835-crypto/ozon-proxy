const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ⚡ вставь сюда свой ключ от ScraperAPI
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY || "b411aea5a9aa179ec0e6e24eeb304689";

app.get("/", (req, res) => {
  res.send("Ozon Proxy через ScraperAPI работает ✅. Используй /product/:sku");
});

app.get("/product/:sku", async (req, res) => {
  const sku = req.params.sku;
  const targetUrl = `https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/product/${sku}/`;

  try {
    // обращаемся через ScraperAPI
    const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&country=ru`;

    const response = await axios.get(scraperUrl, {
      timeout: 30000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!response.data || typeof response.data !== "object") {
      return res.json({ error: "Не получили JSON от ScraperAPI" });
    }

    // парсим widgetStates
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
