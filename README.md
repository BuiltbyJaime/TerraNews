# Terra News 📰

**Terra News** is a global news aggregation web application that allows users to explore real-time news headlines from countries around the world. Users can interact with a map, select a country, and view the latest top stories in a clean, responsive interface. If news cannot be fetched from the primary source, the app intelligently falls back to a secondary API to ensure a seamless experience.

---

## 📌 Project Overview

**Goal:**  
To create a responsive, map-based news aggregation platform that dynamically fetches and displays top news articles by country.

**Problem Solved:**  
Global news is often scattered across sites and not visualized geographically. Terra News allows users to discover global news in a visual, intuitive way by interacting with a map.

---

## 💻 Features

- 🌍 Interactive map using Leaflet.js and custom markers
- 🗺️ Country-based news filtering via map markers and dropdown
- 🧠 Dynamic switching between two news APIs (NewsAPI and Mediastack) to ensure availability
- 🔎 Keyword search and language filtering
- 📱 Fully responsive design (mobile + desktop)
- 💾 Local storage of last search preferences
- ✨ Visually styled using modern CSS practices

---

## ⚙️ Technologies Used

- JavaScript (Vanilla)
- HTML5 & CSS3
- Leaflet.js (for map)
- NewsAPI.org
- Mediastack API
- Express.js (Node.js backend)
- Fetch API
- LocalStorage API

---

## 🔧 Project Setup Instructions

1. **Clone this repo**

   ```bash
   git clone https://github.com/yourusername/terra-news.git
   cd terra-news
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   ```bash
   touch .env
   ```

4. **Add API keys to `.env`**

   ```
   NEWS_API_KEY=your_newsapi_key
   MEDIASTACK_API_KEY=your_mediastack_key
   ```

5. **Start the server**

   ```bash
   node server.js
   ```

6. **Visit the app**
   ```
   http://localhost:3000
   ```

---

## 📁 Folder Structure

```
terra-news/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── scripts.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## ✅ Capstone Requirements Checklist

### 🎓 Technical Requirements

- [x] **API Integration**  
      Uses both NewsAPI and Mediastack to fetch and display real-time news data

- [x] **At least three features from the feature list:**

  - Analyze data stored in arrays and display it
  - Calculate/display data based on external input (e.g. user selection)
  - Visualize data using map interface (Leaflet.js with markers)

- [x] **Responsive Design**

  - Media queries and flexible layout used for mobile/desktop

- [x] **README**  
      This file clearly explains the project and setup steps

- [x] **10+ Git commits**  
      Documented throughout development using terminal Git

---
