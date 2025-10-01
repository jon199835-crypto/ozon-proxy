export default async function handler(req, res) {
  // 👇 твой новый exec-URL
  const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbxWvLm70bVemCrquxTJ6a9APW_cY4QHgLbF_fwRrh0mtL5zVvlgz86O9zFqP4FgnmV9/exec";

  if (req.method !== "POST") {
    return res.status(200).send("✅ Proxy alive (exec)");
  }

  try {
    const update = req.body || {};

    // Проксируем JSON в твой GAS
    const r = await fetch(GAS_EXEC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
      redirect: "follow" // ⚡️ это критично, иначе будет 302
    });

    const text = await r.text();
    console.log("➡️ GAS response:", r.status, text);

    // Telegram ждёт только 200 OK
    return res.status(200).send("OK FORWARDED (exec)");
  } catch (err) {
    console.error("❌ Proxy error:", err);
    return res.status(200).send("Proxy error: " + err.message);
  }
}
