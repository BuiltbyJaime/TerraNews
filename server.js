require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/news', async (req, res) => {
  const { endpoint = 'top-headlines', q = '', country = '', language = '' } = req.query;
  const params = new URLSearchParams();

  if (q) params.append('q', q);
  if (endpoint === 'top-headlines' && country) {
    params.append('country', country);
  } else if (endpoint === 'everything' && language) {
    params.append('language', language);
  }

  const url = `https://newsapi.org/v2/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
