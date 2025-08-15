require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/news", async (req, res) => {
  const {
    endpoint = "top-headlines",
    q = "",
    country = "",
    language = "",
  } = req.query;

  const newsApiParams = new URLSearchParams();
  if (q) newsApiParams.append("q", q);
  if (endpoint === "top-headlines" && country)
    newsApiParams.append("country", country);
  if (endpoint === "everything" && language)
    newsApiParams.append("language", language);

  const newsApiUrl = `https://newsapi.org/v2/${endpoint}?${newsApiParams.toString()}`;

  try {
    const response = await fetch(newsApiUrl, {
      headers: { "X-Api-Key": process.env.NEWS_API_KEY },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    const shouldUseNewsAPI =
      response.ok &&
      data.status === "ok" &&
      Array.isArray(data.articles) &&
      data.articles.length > 0;

    if (shouldUseNewsAPI) {
      return res.status(200).json({
        status: "ok",
        source: "newsapi",
        articles: data.articles,
      });
    }

    const mediastackParams = new URLSearchParams({
      access_key: process.env.MEDIASTACK_API_KEY,
      countries: country || "us",
      languages: language || "en",
      keywords: q || "",
      limit: 50,
    });

    const mediastackUrl = `http://api.mediastack.com/v1/news?${mediastackParams.toString()}`;
    const fallbackRes = await fetch(mediastackUrl);
    const fallbackData = await fallbackRes.json();

    const mappedArticles = (fallbackData.data || []).map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.published_at,
      source: { name: article.source },
    }));

    return res.status(200).json({
      status: "ok",
      source: "mediastack",
      articles: mappedArticles,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Both APIs failed",
      articles: [],
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// require("dotenv").config();
// const express = require("express");
// const fetch = require("node-fetch");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/api/news", async (req, res) => {
//   const { keywords = "", countries = "", languages = "" } = req.query;

//   const mediastackParams = new URLSearchParams({
//     access_key: process.env.MEDIASTACK_API_KEY,
//     keywords,
//     countries,
//     languages,
//     limit: 50,
//   });

//   const mediastackUrl = `http://api.mediastack.com/v1/news?${mediastackParams.toString()}`;

//   try {
//     const response = await fetch(mediastackUrl);
//     const data = await response.json();

//     const mappedArticles = (data.data || []).map((article) => ({
//       title: article.title,
//       description: article.description,
//       url: article.url,
//       urlToImage: article.image,
//       publishedAt: article.published_at,
//       source: { name: article.source },
//     }));

//     return res.status(200).json({
//       status: "ok",
//       source: "mediastack",
//       articles: mappedArticles,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: "Failed to fetch from Mediastack",
//       articles: [],
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
