export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    console.log("📥 Telegram update:", JSON.stringify(update));

    // Пересылаем в Google Apps Script
    const r = await fetch("https://script.google.com/macros/s/AKfycby09uPOCTy1XW6mFxjU5i6zOn0y0DUImXNJqnYJ_SGLcdAj4u8np2CN8WPBu819yUyY/exec", {
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
