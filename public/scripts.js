document.addEventListener("DOMContentLoaded", ()=> {

    const endpointSelect = document.getElementById("endpoint");
    const languageDropdown = document.getElementById("language");
    const countryDropdown = document.getElementById("country"); 
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.querySelector(".results");
    const keywordInput = document.getElementById("keyword");

// Assigning values for my functions to manipulate the search section 


function topHeadlinesParameters () {
    if (endpointSelect.value=== "top-headlines") {
        languageDropdown.style.display = "none";
        languageDropdown.value = "";
        
        countryDropdown.style.display = "inline-block";
        searchForm.style.display = "none";
        searchForm.value = ""
        


    } else if (endpointSelect.value === "everything") {
    languageDropdown.style.display = "inline-block";
    countryDropdown.style.display = "none";
    countryDropdown.value = "";
    searchForm.style.display = "inline-block"
    searchForm.value = ""

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




// Used AI to help create these Async and Await functions because I was struggling in this area. 
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
    const endpoint = endpointSelect.value;
    const language = languageDropdown.value;
    const country = countryDropdown.value;

  let url = `/api/news?endpoint=${endpoint}&q=${encodeURIComponent(keywordInput.value)}`;
    if (endpoint === "top-headlines" && country) {
    url += `&country=${country}`;
    } else if (endpoint === "everything" && language) {
    url += `&language=${language}`;
    }

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayArticles(data.articles);
  } catch (err) {
    console.error("Error fetching news:", err);
    resultsContainer.innerHTML = `<p>Could not fetch news articles.</p>`;
  }

  localStorage.setItem('lastSearch', JSON.stringify({
  endpoint,
  keyword: keywordInput.value,
  country,
  language
}));
});


// These function allow the articles to form in the results section. 
function displayArticles(articles) {
  resultsContainer.innerHTML = ""; // To clear previous results
  if (!articles || articles.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  articles.slice(0, 50).forEach(article => {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");

    if (article.urlToImage) {
      const img = document.createElement("img");
      img.src = article.urlToImage;
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



// This section is to load Leaflet and to set the view when refreshing
var map = L.map('map').setView([8.61, -5.45], 1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);





// Used AI to help me create all the markers for users to click on to save time.  Created an array first and then used a function that used that array to make all the markers on the map.  In the future, when more markers are needed, I'll just add them to the array so they are automatically added. 

const countryMarkers = [
    { name: 'United States', code: 'us', coords: [38.9072, -77.0369] },  // Washington, DC
    { name: 'United Kingdom', code: 'gb', coords: [51.5074, -0.1278] },  // London
    { name: 'Australia', code: 'au', coords: [-35.2809, 149.13] },       // Canberra
    { name: 'Canada', code: 'ca', coords: [45.4215, -75.6972] },         // Ottawa
    { name: 'France', code: 'fr', coords: [48.8566, 2.3522] },           // Paris
    { name: 'Germany', code: 'de', coords: [52.52, 13.405] },            // Berlin
    { name: 'Italy', code: 'it', coords: [41.9028, 12.4964] },           // Rome
    { name: 'Netherlands', code: 'nl', coords: [52.3676, 4.9041] },      // Amsterdam
    { name: 'Norway', code: 'no', coords: [59.9139, 10.7522] },          // Oslo
    { name: 'Russia', code: 'ru', coords: [55.7558, 37.6173] },          // Moscow
    { name: 'China', code: 'cn', coords: [39.9042, 116.4074] },          // Beijing
    { name: 'Japan', code: 'jp', coords: [35.6762, 139.6503] },          // Tokyo
    { name: 'India', code: 'in', coords: [28.6139, 77.209] },            // New Delhi
    { name: 'Brazil', code: 'br', coords: [-15.8267, -47.9218] },        // Brasília
    { name: 'Argentina', code: 'ar', coords: [-34.6037, -58.3816] },     // Buenos Aires
    { name: 'South Africa', code: 'za', coords: [-25.7479, 28.2293] },   // Pretoria
    { name: 'Mexico', code: 'mx', coords: [19.4326, -99.1332] },         // Mexico City
    { name: 'Spain', code: 'es', coords: [40.4168, -3.7038] },           // Madrid
    { name: 'Sweden', code: 'se', coords: [59.3293, 18.0686] },          // Stockholm
    { name: 'New Zealand', code: 'nz', coords: [-41.2865, 174.7762] }    // Wellington
];

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//     .openPopup(); How to make a marker on map


countryMarkers.forEach(country => {
  L.marker(country.coords)
    .addTo(map)
    .bindPopup(`<strong>${country.name}</strong><br>Click for headlines.`)
    .on("click", () => {
        countryDropdown.value = country.code;
        keywordInput.value = ""; // clear previous search to show local news only
        endpointSelect.value = "top-headlines";
        topHeadlinesParameters();
        searchForm.dispatchEvent(new Event("submit"));
      });
        
    });

topHeadlinesParameters ();


// Used AI to create a local storage of the last searched parameters
const lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
if (lastSearch) {
  endpointSelect.value = lastSearch.endpoint;
  keywordInput.value = lastSearch.keyword;
  countryDropdown.value = lastSearch.country;
  languageDropdown.value = lastSearch.language;
  topHeadlinesParameters();
  searchForm.dispatchEvent(new Event("submit"));
}


});



