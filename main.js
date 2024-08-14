const form = document.querySelector("form");
const repaymentRadio = document.getElementById("repaymentRadio");
const interestRadio = document.getElementById("interestRadio");
const resultContainer = document.getElementById("resultContainer");
const mortgageAmount = document.getElementById("mortgageAmount");
const mortgageTerm = document.getElementById("mortgageTerm");
const mortgageRate = document.getElementById("mortgageRate");

async function loadLanguage(lang) {
  const response = await fetch(`./lang/${lang}.json`);
  const translations = await response.json();
  return translations;
}

function applyTranslations(translations) {
  document.querySelector("h1").textContent = translations.title;
  document.querySelector("button").textContent = translations.clear_button;
  document.querySelector('label[for="amount"]').textContent =
    translations.amount_label;
  document.querySelector('label[for="term"]').textContent =
    translations.term_label;
  document.querySelector('label[for="rate"]').textContent =
    translations.rate_label;
  document.querySelector('label[for="type"]').textContent =
    translations.type_label;
  document.getElementById("repaymentText").textContent =
    translations.repayment_label;
  document.getElementById("interestsText").textContent =
    translations.interests_label;
  document.getElementById("moneySymbol").textContent =
    translations.money_symbol;
  document.getElementById("durationSymbol").textContent =
    translations.duration_symbol;
  document.getElementById("calculBtnText").textContent =
    translations.calculate_button;
  document.getElementById("yourResultsTitle").textContent =
    translations.results_title;
  const emptyResult = document.getElementById("emptyResult");
  if (emptyResult) {
    document.getElementById("emptyResultsText").textContent =
      translations.empty_results_text;
    document.getElementById("yourResultsTitle").textContent =
      translations.results_title;
  }
  const completedResult = document.getElementById("completedResult");
  if (completedResult) {
    document.getElementById("yourResultsTitle").textContent =
      translations.results_title_completed;
    document.getElementById("resultsText").textContent =
      translations.completed_results_text;
    document.getElementById("monthlyRepaymentsTitle").textContent =
      translations.monthly_repayment_title;
    document.getElementById("totalOverTermTitle").textContent =
      translations.total_over_term_title;
  }

  // Faites de même pour tous les autres textes
}

let selectedLang = "en"; // Langue par défaut

document.getElementById("languageSelector").addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadLanguage(selectedLang).then((translations) => {
    applyTranslations(translations);
  });
});

// Chargement initial avec la langue par défaut
loadLanguage(selectedLang).then((translations) => {
  applyTranslations(translations);
});

const calculMonthlyPayment = (amountValue, duration, rateValue) => {
  let monthlyRate = rateValue / 100 / 12;
  let numberOfPayments = duration * 12;
  let monthlyPayment =
    (amountValue * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  return monthlyPayment.toFixed(2);
};

const calculMonthlyInterest = (amountValue, rateValue) => {
  let annualrate = rateValue / 100;

  let monthlyInterest = (annualrate * amountValue) / 12;

  return monthlyInterest.toFixed(2);
};

removeErrors = () => {
  document.getElementById("error-amount").textContent = "";
  document.getElementById("error-rate").textContent = "";
  document.getElementById("error-duration").textContent = "";
  document.getElementById("error-type").textContent = "";
  mortgageAmount.closest(".input-container").style.border = "";
  mortgageRate.closest(".input-container").style.border = "";
  mortgageTerm.closest(".input-container").style.border = "";
  document.querySelectorAll(".symbol").forEach((symbol) => {
    symbol.classList.remove("input-error");
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  removeErrors();
  const selectedLang = document.getElementById("languageSelector").value;
  loadLanguage(selectedLang).then((translations) => {
    let amountValue = mortgageAmount.value;
    let duration = mortgageTerm.value;
    let rateValue = mortgageRate.value;
    let mortgageType = document.querySelector(
      'input[name="mortgageType"]:checked'
    );

    let valid = true;

    if (!amountValue) {
      document.getElementById("error-amount").textContent =
        "This field is required";

      // Cible le conteneur de l'input
      const inputContainer = mortgageAmount.closest(".input-container");

      // Ajouter une bordure rouge au conteneur de l'input
      inputContainer.style.border = "1px solid var(--red)";

      // Modifier l'arrière-plan du symbole à l'intérieur du même conteneur
      const symbolElement = inputContainer.querySelector(".symbol");
      if (symbolElement) {
        symbolElement.classList.add("input-error");
      }

      valid = false;
    }

    if (!rateValue) {
      document.getElementById("error-rate").textContent =
        "This field is required";

      // Cible le conteneur de l'input
      const inputContainer = mortgageRate.closest(".input-container");

      // Ajouter une bordure rouge au conteneur de l'input
      inputContainer.style.border = "1px solid var(--red)";

      // Modifier l'arrière-plan du symbole à l'intérieur du même conteneur
      const symbolElement = inputContainer.querySelector(".symbol");
      if (symbolElement) {
        symbolElement.classList.add("input-error");
      }

      valid = false;
    }

    if (!duration) {
      document.getElementById("error-duration").textContent =
        "This field is required";

      // Cible le conteneur de l'input
      const inputContainer = mortgageTerm.closest(".input-container");

      // Ajouter une bordure rouge au conteneur de l'input
      inputContainer.style.border = "1px solid var(--red)";

      // Modifier l'arrière-plan du symbole à l'intérieur du même conteneur
      const symbolElement = inputContainer.querySelector(".symbol");
      if (symbolElement) {
        symbolElement.classList.add("input-error");
      }

      valid = false;
    }

    if (!mortgageType) {
      document.getElementById("error-type").textContent =
        "This field is required";
      valid = false;
    }

    if (!valid) {
      resultContainer.style.alignItems = "center";
      resultContainer.innerHTML = `
        <div class="empty-result">
          <div class="img-container">
            <img src="./assets/images/illustration-empty.svg" alt="" />
          </div>
          <h2>Results shown here</h2>
          <p>
            Complete the form and click “calculate repayments” to see what your
            monthly repayments would be.
          </p>
        </div>`;
      loadLanguage(selectedLang).then((translations) => {
        applyTranslations(translations);
      });
    } else {
      let monthlyPayment = calculMonthlyPayment(
        amountValue,
        duration,
        rateValue
      );
      let monthlyInterest = calculMonthlyInterest(amountValue, rateValue);
      resultContainer.style.alignItems = "flex-start";
      const locale = translations.locale;
      const currency = translations.currency;

      if (repaymentRadio.checked) {
        resultContainer.innerHTML = `
           <div class="completed-result" id="completedResult">
            <h2 id="yourResultsTitle"></h2>
            <p id="resultsText"></p>
            <div class="result-container">
              <div class="top-part">
                <h3 id="monthlyRepaymentsTitle"></h3>
                <div id="monthlyRepaymentsResult">${(
                  monthlyPayment * 1
                ).toLocaleString(locale, {
                  style: "currency",
                  currency: currency,
                })}</div>
                </div>
                <div class="bottom-part">
                  <h3 id="totalOverTermTitle"></h3>
                  <div id="totalDueOverTerm">${(
                    monthlyPayment *
                    12 *
                    duration
                  ).toLocaleString(locale, {
                    style: "currency",
                    currency: currency,
                  })}</div>
                </div>
              </div>
            </div>`;
      } else if (interestRadio.checked) {
        resultContainer.innerHTML = `
            <div class="completed-result" id="completedResult">
              <h2 id="yourResultsTitle"></h2>
              <p id="resultsText"></p>
              <div class="result-container">
                <div class="top-part">
                  <h3 id="monthlyRepaymentsTitle"></h3>
                  <div id="monthlyRepaymentsResult"> ${(
                    monthlyInterest * 1
                  ).toLocaleString(locale, {
                    style: "currency",
                    currency: currency,
                  })}</div>
                </div>
                <div class="bottom-part">
                  <h3 id="totalOverTermTitle"></h3>
                  <div id="totalDueOverTerm">${(
                    monthlyInterest *
                    12 *
                    duration
                  ).toLocaleString(locale, {
                    style: "currency",
                    currency: currency,
                  })}</div>
                </div>
              </div>
            </div>`;
      }

      // Appliquer les traductions après avoir généré les résultats
      applyTranslations(translations);
    }
  });
});

//Clear inputs
const resetInputs = (e) => {
  mortgageAmount.value = "";
  mortgageTerm.value = "";
  mortgageRate.value = "";
  interestRadio.checked = false;
  repaymentRadio.checked = false;
  removeErrors();
  document.querySelectorAll(".btn-container").forEach((container) => {
    container.classList.remove("focused");
  });
  document.querySelectorAll(".symbol").forEach((symbol) => {
    symbol.classList.remove("input-error");
  });
};

// Input accesibility
document.querySelectorAll(".input-field").forEach((input) => {
  input.addEventListener("focus", function () {
    this.closest(".input-container").classList.add("focused");
  });

  input.addEventListener("blur", function () {
    this.closest(".input-container").classList.remove("focused");
  });
});

document.querySelectorAll(".radio-btn").forEach((input) => {
  input.addEventListener("change", function () {
    document.querySelectorAll(".btn-container").forEach((container) => {
      container.classList.remove("focused");
    });

    if (this.checked) {
      this.closest(".btn-container").classList.add("focused");
    }
  });
});
