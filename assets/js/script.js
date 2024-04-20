const key = "fca_live_nWQkBYVbu8KYnjGdakLYLiZDkXCm3ul67o10LW1z";

const state = {
  openedDrawer: null,
  currencies: [],
  filteredCurrencies: [],
  base: "USD",
  target: "EUR",
  rates: {},
  baseValue: 1,
};

const ui = {
  controls: document.getElementById("controls"),
  drawer: document.getElementById("drawer"),
  dismissBtn: document.getElementById("dismiss-btn"),
  currenciesList: document.getElementById("currency-list"),
  searchInput: document.getElementById("search"),
  baseBtn: document.getElementById("base"),
  targetBtn: document.getElementById("target"),
  exchangeRate: document.getElementById("exchange-rate"),
  baseInput: document.getElementById("base-input"),
  targetInput: document.getElementById("target-input"),
};

const {
  controls,
  drawer,
  dismissBtn,
  currenciesList,
  searchInput,
  baseBtn,
  targetBtn,
  exchangeRate,
  baseInput,
  targetInput,
} = ui;

let {
  openedDrawer,
  currencies,
  filteredCurrencies,
  base,
  target,
  rates,
  baseValue,
} = state;

const setupEventlisteners = () => {
  document.addEventListener("DOMContentLoaded", initApp);
  controls.addEventListener("click", showDrawer);
  dismissBtn.addEventListener("click", hideDrawer);
  searchInput.addEventListener("input", filterCurrency);
  currenciesList.addEventListener("click", selectPair);
  baseInput.addEventListener("change", convertInput);
};

const initApp = () => {
  fetchCurrencies();
  fetchExchangeRate();
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

const selectPair = (e) => {
  if (e.target.getAttribute("data-code")) {
    state[openedDrawer] = e.target.dataset.code;

    loadExchangeRate();
    hideDrawer();
  }
};

const convertInput = () => {
  baseValue = parseFloat(baseInput.value) || 1;
  loadExchangeRate();
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

const displayConversions = () => {
  updateButtons();
  updateInputs();
  updateExchangeRate();
};

const updateButtons = () => {
  [baseBtn, targetBtn].forEach((btn) => {
    const code = state[btn.id];

    btn.textContent = code;
    btn.style.setProperty("--image", `url(${getImageURL(code)})`);
  });
};

const updateInputs = () => {
  const result = baseValue * rates[base][target];

  targetInput.value = result.toFixed(4);
  baseInput.value = baseValue;
};

const updateExchangeRate = () => {
  const rate = rates[base][target].toFixed(4);
  exchangeRate.textContent = ` 1 ${base} = ${rate} ${target}`;
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

const loadExchangeRate = () => {
  if (typeof rates[base] !== "undefined") {
    displayConversions();
  } else {
    fetchExchangeRate();
  }
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

const fetchExchangeRate = () => {
  fetch(
    `https://api.freecurrencyapi.com/v1/latest?apikey=${key}&base_currency=${base}`
  )
    .then((res) => res.json())
    .then(({ data }) => {
      rates[base] = data;
      displayConversions();
    })
    .catch(console.error);
};

setupEventlisteners();
