const key = "fca_live_nWQkBYVbu8KYnjGdakLYLiZDkXCm3ul67o10LW1z";
const state = {
  openedDrawer: null,
  currencies: [],
};

const ui = {
  controls: document.getElementById("controls"),
  drawer: document.getElementById("drawer"),
  dismissBtn: document.getElementById("dismiss-btn"),
  currenciesList: document.getElementById("currency-list"),
};

const { controls, drawer, dismissBtn, currenciesList } = ui;
let { openedDrawer, currencies } = state;

const setupEventlisteners = () => {
  document.addEventListener("DOMContentLoaded", initApp);
  controls.addEventListener("click", showDrawer);
  dismissBtn.addEventListener("click", hideDrawer);
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
  openedDrawer = null;
  drawer.classList.remove("show");
  console.log(state);
};

const displayCurrencies = () => {
  currenciesList.innerHTML = currencies
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
      displayCurrencies();
    })
    .catch(console.error);
};

setupEventlisteners();
