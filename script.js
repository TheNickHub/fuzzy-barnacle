// Define API endpoint URL
const apiUrl = "https://data.medicare.gov/resource/rbry-mqwu.json";

// Get references to DOM elements
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

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
    li.textContent = `${hospital.provider_name} - ${hospital.address}`;
    ul.appendChild(li);
  });
  resultsDiv.appendChild(ul);
}

// Function to handle search
async function search() {
  // Get user search query
  const query = searchInput.value.trim();

  // If search query is empty, display a message
  if (query === "") {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  // Fetch hospital data from API
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Filter hospitals based on search query
const filteredData = data.filter((hospital) => {
    return hospital.provider_name.toLowerCase().includes(query.toLowerCase());
  });
  
  // Display search results on the page
  displayResults(filteredData);
}