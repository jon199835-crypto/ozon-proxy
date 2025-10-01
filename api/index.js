export default async function handler(req, res) {
  const GAS_EXEC_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLg-WlicVAu9SiUedQ84nDG9rCYKL8QkBwdyPphQuJBtzLF2v68tKbZNZrU41wHvogxdtOVWJoobmNtdwi_nuxq3liwO1OLBtBoDeeK9Kb3EvW8PxGGJ03IgC5xIA0puiS2Kf6vO1FpkNWrz-EXdRHFCHI2gHAPxUs3RopPjrfTcLMNuXLF5cskxIRmlOGcNohi1VbWOEp8G4SA_DKI_bwGQoATGXb0zq_Jl4e2lPm6InxxnJP1lYo69YXLRQA64hC65ZV3Jzib2pmnpAPWOLFiQw85ZUQ&lib=MWU1KQnTxyXH7F9CuBMTqaVnitNJBIhCK";

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
