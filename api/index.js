export default async function handler(req, res) {
  const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbxWvLm70bVemCrquxTJ6a9APW_cY4QHgLbF_fwRrh0mtL5zVvlgz86O9zFqP4FgnmV9/exec";

  if (req.method !== "POST") {
    return res.status(200).send("✅ Proxy alive");
  }

  try {
    // Тело запроса от Telegram
    const update = req.body;

    // Проксируем как есть в GAS
    const r = await fetch(GAS_EXEC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
      redirect: "follow"
    });

    const text = await r.text();
    console.log("➡️ GAS response:", text);

    // Telegram ждёт только 200 OK
    return res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Proxy error:", err);
    return res.status(200).send("Proxy error: " + err.message);
  }
}
