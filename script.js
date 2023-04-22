// Define API endpoint URL
const apiUrl = "https://data.medicare.gov/resource/rbry-mqwu.json";

// Get references to DOM elements
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

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

    // Create a div to hold the hospital information
    const div = document.createElement("div");

    // Create an image element for the hospital
    const img = document.createElement("img");
    img.src = hospital.photo;
    img.alt = `${hospital.provider_name} Photo`;
    img.width = 150;
    div.appendChild(img);

    // Create a p element for the hospital name
    const name = document.createElement("p");
    name.textContent = hospital.provider_name;
    div.appendChild(name);

    // Create a p element for the hospital phone number
    const phone = document.createElement("p");
    phone.textContent = hospital.phone_number;
    div.appendChild(phone);

    // Create a p element for the hospital address
    const address = document.createElement("p");
    address.textContent = `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zip_code}`;
    div.appendChild(address);

    li.appendChild(div);
    ul.appendChild(li);
  });
  resultsDiv.appendChild(ul);
}
