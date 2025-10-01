export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    console.log("📥 Telegram update:", JSON.stringify(update));

    // Пересылаем в Google Apps Script
    const r = await fetch("https://script.google.com/macros/s/AKfycbxCDEN65BNjvSalSa2UpYMAqVV1VwLdPdS-5u9zkjQvicOhB5ueGd5S4BbQ4rxEYg4/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    });

    console.log("➡️ Forwarded to Apps Script, status:", r.status);

    res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error("❌ Error forwarding:", err);
    res.status(500).send("Error: " + err.message);
  }
}
