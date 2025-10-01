export default async function handler(req, res) {
  const GAS_EXEC_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLifCWLCYfkqmQZfAz_PWr-lBseCHpycvHh6K-NwecC-s6lpr4GuP4reBJNba9gJB3WyBv-FpcaHr--JErbA-NqwG-hL3BIVZ0TYRH8K5FoDzoXZnWuYwHZfzUumgiDbDMpEBtPskPPRLPdyPhDhZUxzfJEHQLy8l-OXxYGNf95xZiIuFVhRM4qC860AIwM2QtUVCAUe5WHRz9ceVL79EBrRXgwpm9UvIiNv7e2XHdlefJDc4OnRPRPjW11UiqkauZaGKpgbYO71IQYv2iciis2yxlBmMA&lib=MWU1KQnTxyXH7F9CuBMTqaVnitNJBIhCK"; 
  // сюда вставь свой свежий googleusercontent-URL

  if (req.method !== 'POST') {
    try {
      // пробросим GET в твой GAS
      const r = await fetch(GAS_EXEC_URL);
      const text = await r.text();
      return res.status(200).send("🔗 GAS ответ: " + text);
    } catch (err) {
      return res.status(500).send("❌ Ошибка при GET в GAS: " + err.message);
    }
  }

  try {
    const update = req.body;
    console.log("📥 Telegram update:", JSON.stringify(update));

    const r = await fetch(GAS_EXEC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
      redirect: "follow"
    });

    const text = await r.text();
    console.log("➡️ GAS ответ:", text);

    return res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Proxy error:", err);
    return res.status(200).send("Proxy error");
  }
}
