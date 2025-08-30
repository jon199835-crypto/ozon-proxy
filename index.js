const express = require("express");
const axios = require("axios");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

// корневой маршрут
app.get("/", (req, res) => {
  res.send("Ozon Proxy работает ✅. Используй /product/:sku");
});

// маршрут для SKU
app.get("/product/:sku", async (req, res) => {
  const sku = req.params.sku;
  const apiUrl = `https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/product/${sku}/`;

  try {
     // ⚡ данные прокси: вставь свои
    const proxyHost = "gate.decodo.com";  // например, gate.smartproxy.com
    const proxyPort = 40001;                  // порт (обычно 10000 у Smartproxy)
    const proxyUser = "spcjoogw8u";             // твой логин от прокси
    const proxyPass = "3i3Z8Av6hthZLwcki+";             // твой пароль от прокси

    // создаём агент, который игнорирует SSL-ошибки
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.get(apiUrl, {
      httpsAgent: agent, // игнор SSL
      proxy: {
        host: proxyHost,
        port: proxyPort,
        auth: {
          username: proxyUser,
          password: proxyPass
        }
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      timeout: 20000
    });

    if (!response.data || typeof response.data !== "object") {
      return res.json({ error: "Не получили JSON от Ozon" });
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

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
