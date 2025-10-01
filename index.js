export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    // Пересылаем в твой Apps Script
    await fetch("https://script.google.com/macros/s/AKfycby09uPOCTy1XW6mFxjU5i6zOn0y0DUImXNJqnYJ_SGLcdAj4u8np2CN8WPBu819yUyY/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    });

    res.status(200).send("OK FORWARDED");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
}
