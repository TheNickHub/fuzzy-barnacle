// Define API endpoint URL
const apiUrl =
  "https://data.princegeorgescountymd.gov/resource/county-hospitals.json";

// Get references to DOM elements
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const mapDiv = document.getElementById("map");

// Initialize map
let map = null;

function initMap() {
  map = L.map(mapDiv).setView([38.8836, -76.9818], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);
}

// Function to display search results on the page
function displayResults(hospitals) {
  // Clear previous search results
  resultsDiv.innerHTML = "";

  // If no hospitals match the search query, display a message
  if (hospitals.length === 0) {
    resultsDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Create HTML elements for each hospital and add to results container
  const ul = document.createElement("ul");
  hospitals.forEach((hospital) => {
    const li = document.createElement("li");

    // Use hospital location data to create a marker on the map
    const marker = L.marker([hospital.latitude, hospital.longitude]).addTo(
      map
    );
    marker.bindPopup(hospital.facility_name);

    // Add hospital name to list item
    li.textContent = hospital.facility_name;

    ul.appendChild(li);
  });

  // Add list of hospitals to results container
  resultsDiv.appendChild(ul);
}

// Function to handle search button click
function searchHospitals() {
  const searchInput = document.getElementById("search");
  const searchTerm = searchInput.value;

  // Fetch hospital data from API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Filter hospital data based on search term
      const hospitals = data.filter((hospital) => {
        return hospital.facility_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      // Display search results on the page
      displayResults(hospitals);
    })
    .catch((error) => {
      console.error("Error fetching hospital data:", error);
    });
}

// Add click listener to search button
searchBtn.addEventListener("click", searchHospitals);

// Call initMap function to initialize map
initMap();
