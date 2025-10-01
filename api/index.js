export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    console.log("📥 Telegram update:", JSON.stringify(update));

    // Пересылаем напрямую в Apps Script (googleusercontent URL, без 302 редиректа)
    const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjk7K5V-z2JAIibklkiQXCMqtQ1nkfR2TpRq0AkcyI7bLsiiTJ7WJdgVyRQFZDvBoNQPkCpDQk3YaDWk5nUYdtFkPOIkMTjYqHP8KtPlbmqp14OgYtCGPo4uC5X2ruDiRJhTfOrE4jIY1YDJPySPAeKAMLPR5lTS96Y0HS8mESVVmztdaJ9l_ZLpGIJVbqhYc7-44SonYbBItpZSmzFwg-QZS0KRwG0D226OzSb5I5kFA4Ndakk4MybwSIlar7ByGPyyZDffoCnlQrv027C_QxP8WCjag&lib=MWU1KQnTxyXH7F9CuBMTqaVnitNJBIhCK", {
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
