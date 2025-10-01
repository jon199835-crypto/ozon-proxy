export default async function handler(req, res) {
  // ТВОЙ АКТУАЛЬНЫЙ EXEC-URL (не меняй его; обновляй код в GAS через "Edit deployment")
  const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbxWvLm70bVemCrquxTJ6a9APW_cY4QHgLbF_fwRrh0mtL5zVvlgz86O9zFqP4FgnmV9/exec";

  if (req.method !== "POST") {
    try {
      // Для проверки в браузере проксируем GET → GAS doGet
      const r = await fetch(GAS_EXEC_URL, { method: "GET", redirect: "follow" });
      const text = await r.text();
      return res.status(200).send("🔗 GAS ответ: " + text);
    } catch (err) {
      return res.status(200).send("Proxy GET error: " + err.message);
    }
  }

  try {
    // Принимаем апдейт от Telegram и пересылаем в GAS
    const update = req.body; // у Vercel body уже распарсен
    // Если вдруг пусто — подстрахуемся:
    const safeUpdate = update && Object.keys(update).length ? update : { ping: true };

    const r = await fetch(GAS_EXEC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safeUpdate),
      redirect: "follow",            // ВАЖНО: позволяем редирект с exec на googleusercontent
    });

    const text = await r.text();
    console.log("➡️ GAS status:", r.status, "body:", text);

    // Telegram счастлив с любым 200 — отдаём сразу
    return res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Proxy POST error:", err);
    // Всё равно 200, чтобы Telegram не ретраил
    return res.status(200).send("Proxy error");
  }
}
