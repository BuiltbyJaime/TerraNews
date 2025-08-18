require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`🌐 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/api/news", async (req, res) => {
  console.log("🟢 /api/news was hit");

  const {
    endpoint = "top-headlines",
    q = "",
    country = "",
    language = "",
  } = req.query;

  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (endpoint === "top-headlines" && country)
    params.append("country", country);
  if (endpoint === "everything" && language)
    params.append("language", language);

  const url = `https://newsapi.org/v2/${endpoint}?${params.toString()}`;
  const apiKey = process.env.NEWS_API_KEY; // ✅ This was missing!

  console.log("\n===================");
  console.log("🔎 Final URL:", url);
  console.log("🔐 API Key Loaded:", JSON.stringify(apiKey));
  console.log("===================\n");

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "API key is undefined on the server" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    console.log("🌍 Full NewsAPI URL:", url);

    const text = await response.text();

    console.log("🧾 Raw NewsAPI Response:", text);

    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(text);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/test", (req, res) => {
  console.log("✅ /test route was hit");
  res.send("Hello from /test!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
