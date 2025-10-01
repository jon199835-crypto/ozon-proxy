export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send("OK GET");
  }

  try {
    const update = req.body;

    // Пересылаем в твой Apps Script
    await fetch("https://script.google.com/macros/s/AKfycbxCDEN65BNjvSalSa2UpYMAqVV1VwLdPdS-5u9zkjQvicOhB5ueGd5S4BbQ4rxEYg4/exec", {
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
