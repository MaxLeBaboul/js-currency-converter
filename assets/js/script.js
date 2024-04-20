const key = "fca_live_nWQkBYVbu8KYnjGdakLYLiZDkXCm3ul67o10LW1z";
const state = {
  openedDrawer: null,
  currencies: [],
  filteredCurrencies: [],
  base: "USD",
  target: "EUR",
};

const ui = {
  controls: document.getElementById("controls"),
  drawer: document.getElementById("drawer"),
  dismissBtn: document.getElementById("dismiss-btn"),
  currenciesList: document.getElementById("currency-list"),
  searchInput: document.getElementById("search"),
};

const { controls, drawer, dismissBtn, currenciesList, searchInput } = ui;
let { openedDrawer, currencies, filteredCurrencies, base, target } = state;

const setupEventlisteners = () => {
  document.addEventListener("DOMContentLoaded", initApp);
  controls.addEventListener("click", showDrawer);
  dismissBtn.addEventListener("click", hideDrawer);
  searchInput.addEventListener("input", filterCurrency);
};

const initApp = () => {
  fetchCurrencies();
};

const showDrawer = (e) => {
  if (e.target.hasAttribute("data-drawer")) {
    openedDrawer = e.target.id;
    drawer.classList.add("show");
    console.log(state);
  }
};

const hideDrawer = (e) => {
  clearSearchInput();
  openedDrawer = null;
  drawer.classList.remove("show");
  console.log(state);
};

const filterCurrency = (e) => {
  const keyword = searchInput.value.trim().toLowerCase();
  filteredCurrencies = getAvailableCurrencies().filter(({ code, name }) => {
    return (
      code.toLowerCase().includes(keyword) ||
      name.toLowerCase().includes(keyword)
    );
  });
  displayCurrencies();
};

const displayCurrencies = () => {
  currenciesList.innerHTML = filteredCurrencies
    .map(({ code, name }) => {
      return `
              <li data-code ="${code}">
              <img src="${getImageURL(code)}" alt="${name}">
              <div>
                <h4>${code}</h4>
                <p>${name}</p>
              </div>
            </li>
    `;
    })
    .join("");
};

const getAvailableCurrencies = () => {
  return currencies.filter(({ code }) => {
    return base !== code && target !== code;
  });
};

const clearSearchInput = () => {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
};

const getImageURL = (code) => {
  const flag =
    "https://wise.com/public-resources/assets/flags/rectangle/{code}.png";

  return flag.replace("{code}", code.toLowerCase());
};

const fetchCurrencies = () => {
  fetch(
    `https://api.freecurrencyapi.com/v1/currencies?apikey=${key}&currencies=`
  )
    .then((res) => res.json())
    .then(({ data }) => {
      currencies = Object.values(data);
      filteredCurrencies = getAvailableCurrencies();
      displayCurrencies();
    })
    .catch(console.error);
};

setupEventlisteners();
