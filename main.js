const form = document.querySelector("form");
const repaymentRadio = document.getElementById("repaymentRadio");
const interestRadio = document.getElementById("interestRadio");
const resultContainer = document.getElementById("resultContainer");
const mortgageAmount = document.getElementById("mortgageAmount");
const mortgageTerm = document.getElementById("mortgageTerm");
const mortgageRate = document.getElementById("mortgageRate");

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
  } else {
    let monthlyPayment = calculMonthlyPayment(amountValue, duration, rateValue);
    let monthlyInterest = calculMonthlyInterest(amountValue, rateValue);
    resultContainer.style.alignItems = "flex-start";
    if (repaymentRadio.checked) {
      resultContainer.innerHTML = `
           <div class="completed-result">
           <h2>Your results</h2>
           <p>
           Your results are shown below based on the information you provided.
           To adjust the results, edit the form and click “calculate
           repayments” again.
           </p>
           <div class="result-container">
           <div class="top-part">
           <h3>Your monthly repayments</h3>
           <div id="monthlyRepaymentsResult">${(
             monthlyPayment * 1
           ).toLocaleString("en-GB", {
             style: "currency",
             currency: "GBP",
           })}</div>
            </div>
            <div class="bottom-part">
            <h3>Total you'll repay over the term</h3>
            <div id="totalDueOverTerm">${(
              monthlyPayment *
              12 *
              duration
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</div>
            </div>
            </div>
            </div>`;
    } else if (interestRadio.checked) {
      resultContainer.innerHTML = `
            <div class="completed-result">
            <h2>Your results</h2>
            <p>
            Your results are shown below based on the information you provided. To
            adjust the results, edit the form and click “calculate repayments”
            again.
            </p>
            <div class="result-container">
            <div class="top-part">
            <h3>Your monthly repayments</h3>
            <div id="monthlyRepaymentsResult"> ${(
              monthlyInterest * 1
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</div>
            </div>
            <div class="bottom-part">
            <h3>Total you'll repay over the term</h3>
            <div id="totalDueOverTerm">${(
              monthlyInterest *
              12 *
              duration
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</div>
            </div>
            </div>
            </div>
            `;
    }
  }
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
