export default async function handler(req, res) {
  const TARGET_URL = "https://script.google.com/macros/s/AKfycbx0UzESS0QYpljogWZTGElERnBCddngdQnuqol4NWjFmk8aTjXCCvKoRdsJ4XbDBgdj/exec";

  if (req.method === "POST") {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    return res.status(200).send("OK FORWARDED\n" + text);
  }

  if (req.method === "GET") {
    return res.status(200).send("✅ Proxy alive, forwarding to GAS");
  }

  res.status(405).send("Method Not Allowed");
}
