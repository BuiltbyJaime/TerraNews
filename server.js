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
// Used Chatgpt to correct code concerning an issue with the API key not being parsed correctly in the browser.
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
  const apiKey = process.env.NEWS_API_KEY; //

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

app.get("/api/marker-news", async (req, res) => {
  const { country } = req.query;
  const apiKey = process.env.MEDIASTACK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Mediastack API key not found." });
  }

  if (!country) {
    return res.status(400).json({ error: "Country code is required." });
  }

  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${country}&limit=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Mediastack fetch error:", err);
    res.status(500).json({ error: "Failed to fetch marker news" });
  }
});

app.get("/test", (req, res) => {
  console.log("✅ /test route was hit");
  res.send("Hello from /test!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
