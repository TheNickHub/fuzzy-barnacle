function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#hospital_list");
  target.innerHTML = "";
  list.forEach(function (item) {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function filterList(list, query) {
  return list.filter(function (item) {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutHospitalList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map(function (item) {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

let mapInitialized = false;
let carto;

function initMap(city) {
  if (carto) {
    carto.remove();
  }
  carto = L.map("map").setView([39.0458, -76.6413], 7);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    maxZoom: 18,
  }).addTo(carto);

  fetch(
    "https://www.communitybenefitinsight.org/api/get_hospitals.php?state=MD"
  )
    .then((response) => response.json())
    .then((hospitals) => {
      const hospitalIcon = L.icon({
        iconUrl:
          "https://cdn3.iconfinder.com/data/icons/medical-icons-3/512/Hospital-512.png",
        iconSize: [40, 40],
      });

      const filteredHospitals = hospitals.filter(
        (hospital) => hospital.city === city
      );

      for (const hospital of filteredHospitals) {
        const address =
          hospital.street_address +
          ", " +
          hospital.city +
          ", " +
          hospital.state +
          " " +
          hospital.zip_code;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )}&key=fdbb867d57b24fb5b77b706db67845a1`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const lat = data.results[0].geometry.lat;
            const lng = data.results[0].geometry.lng;
            const marker = L.marker([lat, lng]).bindPopup(hospital.name);
            marker.addTo(carto);
          })
          .catch((error) => console.error(error));
      }

      // Zoom the map
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city + ", Maryland"
      )}&key=fdbb867d57b24fb5b77b706db67845a1`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const lat = data.results[0].geometry.lat;
          const lng = data.results[0].geometry.lng;
          carto.setView([lat, lng], 11);
        })
        .catch((error) => console.error(error));
    });
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.querySelector("city");
  initMap(city);
});

document.addEventListener("DOMContentLoaded", () => {
  const selectCity = document.querySelector("#cities");
  selectCity.addEventListener("change", (event) => {
    const selectedCity = event.target.value;
    initMap(selectedCity);
  });
});

function markerPlace(array, map) {
  console.log("array for markers", array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("markerPlace", item);
    const { coordinates } = item.geocoded_column_1;

    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  });
}

async function mainEvent() {
  // the async keyword means we can make API requests
  // const mainForm = document.querySelector(".main_form");
  // const loadDataButton = document.querySelector("#data_load");
  // const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  // const textField = document.querySelector("filter");
  const citiesDropdown = document.querySelector("#cities");

  //const loadAnimation = document.querySelector("#data_load_animation");
  //loadAnimation.style.display = "none";
  //generateListButton.classList.add("hidden");

  const carto = initMap();

  // const storedData = localStorage.getItem("storedData");
  // let parsedData = JSON.parse(storedData);
  // if (parsedData?.length > 0) {
  //   generateListButton.classList.remove("hidden");
  // }
  localStorage.clear();
  let storedList = localStorage.getItem("hospitalList");
  if (!storedList) {
    const results = await fetch(
      "https://www.communitybenefitinsight.org/api/get_hospitals.php?state=MD"
    );
    storedList = await results.json();
    localStorage.setItem("hospitalList", storedList);
  }

  let currentList = [];
  

  function filterCity(city) {
    const matched = storedList.filter((hospital) => {
      return hospital.city.toLowerCase() === city.toLowerCase();
    });
    return matched;
  }

  console.log(storedList);
  let data = new Set();
  storedList.forEach((hospital) => {
    data.add(hospital.city);
  });

  console.log(data);

  data.forEach((city) => {
    const option = document.createElement("option");
    option.text = city;
    option.value = city;
    citiesDropdown.add(option);
  });

  let selectedCity = "";

  const dropdownMenu = document.querySelector("#cities");
  console.log(dropdownMenu);
  dropdownMenu.addEventListener("change", (event) => {
    selectedCity = event.target.value;
  });

  generateListButton.addEventListener("click", (event) => {
    event.preventDefault();
    const filteredList = filterCity(selectedCity);
    console.log(filteredList);
    injectHTML(filteredList);
  });

  const clearDataButton = document.getElementById("clear");
  const hospitalList = document.getElementById("hospitalList");
  const hospitalMap = document.getElementById("hospitalMap");

  clearDataButton.addEventListener("click", async (event) => {
    localStorage.clear();

    let storedData = localStorage.getItem("hospitalList");
    if (!storedData) {
      const results = await fetch(
        "https://www.communitybenefitinsight.org/api/get_hospitals.php?state=MD"
      );
      const storedList = await results.json();
      localStorage.setItem("hospitalList", JSON.stringify(storedList));

      const hospitalList = document.getElementById("hospital_list");
      hospitalList.innerHTML = "";

      const hospitalMap = document.getElementById("map");
      hospitalList.innerHTML = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
