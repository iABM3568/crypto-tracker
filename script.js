// API URL
const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

// Global variables
let cryptoData = [];
let filteredData = [];

// DOM elements
const searchInput = document.getElementById("searchInput");
const sortByMktCapBtn = document.getElementById("sortByMktCap");
const sortByPercentageBtn = document.getElementById("sortByPercentage");
const tableBody = document.getElementById("tableBody");

// ============================================
// METHOD 1: Fetch data using .then (15 marks)
// ============================================
function fetchDataUsingThen() {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched using .then:", data);
      cryptoData = data;
      filteredData = [...data];
      renderTable(filteredData);
    })
    .catch((error) => {
      console.error("Error fetching data using .then:", error);
      showError("Failed to fetch data. Please try again later.");
    });
}

// ============================================
// METHOD 2: Fetch data using async/await (15 marks)
// ============================================
async function fetchDataUsingAsyncAwait() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data fetched using async/await:", data);

    cryptoData = data;
    filteredData = [...data];
    renderTable(filteredData);
  } catch (error) {
    console.error("Error fetching data using async/await:", error);
    showError("Failed to fetch data. Please try again later.");
  }
}

// ============================================
// Render Table (20 marks)
// ============================================
function renderTable(data) {
  if (data.length === 0) {
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 40px; color: #888;">
                            No cryptocurrencies found matching your search.
                        </td>
                    </tr>
                `;
    return;
  }

  tableBody.innerHTML = data
    .map(
      (coin) => `
                <tr>
                    <td>
                        <div class="coin-info">
                            <img src="${coin.image}" alt="${
        coin.name
      }" class="coin-image">
                            <div>
                                <div class="coin-name">${coin.name}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                    </td>
                    <td class="price">$${formatNumber(coin.current_price)}</td>
                    <td class="volume">$${formatNumber(coin.total_volume)}</td>
                    <td>
                        <span class="change ${
                          coin.price_change_percentage_24h >= 0
                            ? "positive"
                            : "negative"
                        }">
                            ${
                              coin.price_change_percentage_24h >= 0 ? "▲" : "▼"
                            } 
                            ${Math.abs(
                              coin.price_change_percentage_24h
                            ).toFixed(2)}%
                        </span>
                    </td>
                    <td class="market-cap">Mkt Cap : $${formatNumber(
                      coin.market_cap
                    )}</td>
                </tr>
            `
    )
    .join("");
}

// ============================================
// Search Functionality (20 marks)
// ============================================
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();

  if (searchTerm === "") {
    filteredData = [...cryptoData];
  } else {
    filteredData = cryptoData.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );
  }

  renderTable(filteredData);
}

// ============================================
// Sort Functionality (15 marks)
// ============================================
function sortByMarketCap() {
  filteredData.sort((a, b) => b.market_cap - a.market_cap);
  renderTable(filteredData);
}

function sortByPercentageChange() {
  filteredData.sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  renderTable(filteredData);
}

// ============================================
// Helper Functions
// ============================================
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toFixed(2);
}

function showError(message) {
  tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="error">
                            ⚠️ ${message}
                        </div>
                    </td>
                </tr>
            `;
}

// ============================================
// Event Listeners
// ============================================
searchInput.addEventListener("input", handleSearch);
sortByMktCapBtn.addEventListener("click", sortByMarketCap);
sortByPercentageBtn.addEventListener("click", sortByPercentageChange);

// ============================================
// Initialize App
// ============================================
// Using async/await for initial load
// You can switch to fetchDataUsingThen() to test that method
fetchDataUsingAsyncAwait();

// Uncomment below to use .then method instead:
// fetchDataUsingThen();
