function displayResults(hospitals) {
    // Clear previous search results
    resultsDiv.innerHTML = "";
  
    // If no hospitals match the search query, display a message
    if (hospitals.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }
  
    // Create table for displaying hospital information
    const table = document.createElement("table");
  
    // Create table header row
    const headerRow = document.createElement("tr");
    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";
    headerRow.appendChild(nameHeader);
    const addressHeader = document.createElement("th");
    addressHeader.textContent = "Address";
    headerRow.appendChild(addressHeader);
    const phoneHeader = document.createElement("th");
    phoneHeader.textContent = "Phone";
    headerRow.appendChild(phoneHeader);
    table.appendChild(headerRow);
  
    // Create table rows for each hospital
    hospitals.forEach((hospital) => {
      const row = document.createElement("tr");
  
      // Create cell for hospital name
      const nameCell = document.createElement("td");
      nameCell.textContent = hospital.facility_name;
      row.appendChild(nameCell);
  
      // Create cell for hospital address
      const addressCell = document.createElement("td");
      addressCell.textContent = `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zip_code}`;
      row.appendChild(addressCell);
  
      // Create cell for hospital phone number
      const phoneCell = document.createElement("td");
      phoneCell.textContent = hospital.phone_number;
      row.appendChild(phoneCell);
  
      table.appendChild(row);
    });
  
    // Add table to results container
    resultsDiv.appendChild(table);
  }
  