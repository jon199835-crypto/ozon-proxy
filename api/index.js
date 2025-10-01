export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    console.log("📥 Telegram update:", JSON.stringify(update));

    // Пересылаем напрямую в Apps Script (googleusercontent URL, без 302 редиректа)
    const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLheAlyPK70Pl_LmZrnadn3BQ969FtP7Wq09VBowBub6AS8RZc3eriZkkCEAAtdMlONQqkq-bD3sJwkJaMQo5dxS4w3-PDva0aQTw0DYXLbl4yJohO1Ui2DrKmWC0lc12zYz1KyM4Ni7SvS5KUyVlPbN2aK86wM7m_P9stS77tUmc4idxUzRVzc7PqLCbjpF59mHHtdGr4hvWvEWKMKHikFXMwgMZRvuqdmQRRgx_LQbw1-naxzezD8fk7vqGHZD0JJJ0iepSTDKMfbSa4N4_6hnkBTJYg&lib=MWU1KQnTxyXH7F9CuBMTqaVnitNJBIhCK", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    });

    const text = await response.text();
    console.log("➡️ Apps Script ответ:", text);

    res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Error forwarding:", err);
    res.status(500).send("Error: " + err.message);
  }
}
