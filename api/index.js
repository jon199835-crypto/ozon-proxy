export default async function handler(req, res) {
  // твой exec-URL (он постоянный!)
  const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbxWvLm70bVemCrquxTJ6a9APW_cY4QHgLbF_fwRrh0mtL5zVvlgz86O9zFqP4FgnmV9/exec";

  if (req.method !== "POST") {
    // Проверка через браузер
    try {
      const r = await fetch(GAS_EXEC_URL, { method: "GET", redirect: "follow" });
      const text = await r.text();
      return res.status(200).send("🔗 GAS ответ: " + text);
    } catch (err) {
      return res.status(500).send("Proxy GET error: " + err.message);
    }
  }

  try {
    const update = req.body || {};

    // Пересылаем JSON в твой GAS
    const r = await fetch(GAS_EXEC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
      redirect: "follow"   // 👈 обязательно
    });

    const text = await r.text();
    console.log("➡️ GAS response:", r.status, text);

    // Telegram ждёт только 200 OK
    return res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Proxy error:", err);
    return res.status(200).send("Proxy error: " + err.message);
  }
}
