export const config = {
  api: {
    bodyParser: false, // 🚫 отключаем встроенный парсер
  },
};

export default async function handler(req, res) {
  const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycby6j2W1afW24CNOIm0N9001z5pU3yfNQYjI6BD5HkG63pHe9O_iO0XTn18l4rQSL6l6/exec";

  if (req.method !== "POST") {
    return res.status(200).send("✅ Proxy alive (exec, raw body)");
  }

  try {
    // читаем "сырое" тело
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      console.log("📦 RAW BODY:", rawBody);

      const r = await fetch(GAS_EXEC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,        // форвардим как есть
        redirect: "follow"
      });

      const text = await r.text();
      console.log("➡️ GAS response:", r.status, text);

      res.status(200).send("OK FORWARDED RAW");
    });
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(200).send("Proxy error: " + err.message);
  }
}
