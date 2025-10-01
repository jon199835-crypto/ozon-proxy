// api/index.js (Vercel)
export default async function handler(req, res) {
  const TARGET_URL = "https://script.google.com/macros/s/AKfycbyTv4zfPkUa2u66VGjXQwO3Fpvruo9RXnHYMtiYVb0cTGLZHyXolpObEJpFc0mdyPqp/exec";

  if (req.method === "POST") {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    return res.status(200).send("OK FORWARDED\n" + text);
  }

  // проверка доступности
  if (req.method === "GET") {
    return res.status(200).send("✅ Proxy alive, forwarding to GAS");
  }

  res.status(405).send("Method Not Allowed");
}
