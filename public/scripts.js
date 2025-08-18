console.log("✅ scripts.js is running");

document.addEventListener("DOMContentLoaded", () => {
  const endpointSelect = document.getElementById("endpoint");
  const languageDropdown = document.getElementById("language");
  const countryDropdown = document.getElementById("country");
  const searchForm = document.getElementById("searchForm");
  const resultsContainer = document.querySelector(".results");
  const keywordInput = document.getElementById("keyword");

  function topHeadlinesParameters() {
    if (endpointSelect.value === "top-headlines") {
      languageDropdown.style.display = "none";
      languageDropdown.value = "";

      countryDropdown.style.display = "inline-block";
      keywordInput.style.display = "none";
      keywordInput.value = "";
    } else if (endpointSelect.value === "everything") {
      languageDropdown.style.display = "inline-block";
      countryDropdown.style.display = "none";
      countryDropdown.value = "";
      keywordInput.style.display = "inline-block";
    }
  }

  endpointSelect.addEventListener("change", topHeadlinesParameters);

  countryDropdown.addEventListener("change", () => {
    if (countryDropdown.value !== "") {
      keywordInput.value = "";
      endpointSelect.value = "top-headlines";
      topHeadlinesParameters();
      searchForm.dispatchEvent(new Event("submit"));
    }
  });

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const endpoint = endpointSelect.value;
    const language = languageDropdown.value;
    const country = countryDropdown.value;
    const keyword = keywordInput.value.trim();

    let url = `/api/news?endpoint=${encodeURIComponent(endpoint)}`;

    if (keyword) {
      url += `&q=${encodeURIComponent(keyword)}`;
    }

    if (endpoint === "top-headlines") {
      if (country) {
        url += `&country=${encodeURIComponent(country)}`;
      }
    } else if (endpoint === "everything") {
      if (language) {
        url += `&language=${encodeURIComponent(language)}`;
      }
    }

    console.log("🚀 Fetching:", url);

    try {
      const res = await fetch(url);
      const data = await res.json();

      displayArticles(data.articles);
    } catch (err) {
      console.error("Error fetching news:", err);
      resultsContainer.innerHTML = `<p style="color:red;">Could not fetch news articles.</p>`;
    }

    localStorage.setItem(
      "lastSearch",
      JSON.stringify({ endpoint, country, language, keyword })
    );
  });

  // ✅ DISPLAY ARTICLES FUNCTION
  function displayArticles(articles) {
    resultsContainer.innerHTML = ""; // Clear previous results
    if (!articles || articles.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    articles.slice(0, 50).forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("article");

      const imageUrl = article.urlToImage || article.image;

      if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = article.title || "News image";
        img.style.width = "100%";
        articleDiv.appendChild(img);
      }

      const title = document.createElement("h2");
      title.textContent = article.title;
      articleDiv.appendChild(title);

      const desc = document.createElement("p");
      desc.textContent = article.description || "";
      articleDiv.appendChild(desc);

      const link = document.createElement("a");
      link.href = article.url;
      link.target = "_blank";
      link.textContent = "Read more";
      articleDiv.appendChild(link);

      resultsContainer.appendChild(articleDiv);
    });
  }

  var map = L.map("map").setView([8.61, -5.45], 1);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Used Chatgpt to help create a list of the markers
  const countryMarkers = [
    { name: "United States", code: "us", coords: [38.9072, -77.0369] },
    { name: "United Kingdom", code: "gb", coords: [51.5074, -0.1278] },
    { name: "Australia", code: "au", coords: [-35.2809, 149.13] },
    { name: "Canada", code: "ca", coords: [45.4215, -75.6972] },
    { name: "France", code: "fr", coords: [48.8566, 2.3522] },
    { name: "Germany", code: "de", coords: [52.52, 13.405] },
    { name: "Italy", code: "it", coords: [41.9028, 12.4964] },
    { name: "Netherlands", code: "nl", coords: [52.3676, 4.9041] },
    { name: "Norway", code: "no", coords: [59.9139, 10.7522] },
    { name: "Russia", code: "ru", coords: [55.7558, 37.6173] },
    { name: "China", code: "cn", coords: [39.9042, 116.4074] },
    { name: "Japan", code: "jp", coords: [35.6762, 139.6503] },
    { name: "India", code: "in", coords: [28.6139, 77.209] },
    { name: "Brazil", code: "br", coords: [-15.8267, -47.9218] },
    { name: "Argentina", code: "ar", coords: [-34.6037, -58.3816] },
    { name: "South Africa", code: "za", coords: [-25.7479, 28.2293] },
    { name: "Mexico", code: "mx", coords: [19.4326, -99.1332] },
    { name: "Spain", code: "es", coords: [40.4168, -3.7038] },
    { name: "Sweden", code: "se", coords: [59.3293, 18.0686] },
    { name: "New Zealand", code: "nz", coords: [-41.2865, 174.7762] },
  ];

  countryMarkers.forEach((country) => {
    L.marker(country.coords)
      .addTo(map)
      .bindPopup(`<strong>${country.name}</strong><br>Click for headlines.`)
      .on("click", async () => {
        try {
          resultsContainer.innerHTML = "<p>Loading news...</p>";

          const res = await fetch(`/api/marker-news?country=${country.code}`);
          const data = await res.json();

          if (data.error || !data.data) {
            resultsContainer.innerHTML = `<p style="color:red;">${
              data.error || "No results found."
            }</p>`;
            return;
          }

          displayArticles(data.data);
        } catch (err) {
          console.error("Error fetching marker news:", err);
          resultsContainer.innerHTML = `<p style="color:red;">Could not fetch marker news.</p>`;
        }
      });
  });
  const savedSearch = JSON.parse(localStorage.getItem("lastSearch"));

  if (savedSearch) {
    endpointSelect.value = savedSearch.endpoint || "top-headlines";
    countryDropdown.value = savedSearch.country || "";
    languageDropdown.value = savedSearch.language || "";
    keywordInput.value = savedSearch.keyword || "";
  }

  topHeadlinesParameters();
});
