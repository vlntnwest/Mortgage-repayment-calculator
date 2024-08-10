const form = document.querySelector("form");
const repaymentRadio = document.getElementById("repaymentRadio");
const interestRadio = document.getElementById("interestRadio");
const resultContainer = document.getElementById("resultContainer");

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

form.addEventListener("submit", (e) => {
  document.getElementById("error-amount").textContent = "";
  document.getElementById("error-rate").textContent = "";
  document.getElementById("error-duration").textContent = "";
  document.getElementById("error-type").textContent = "";
  mortageAmount.closest(".input-container").style.border = "";
  mortageRate.closest(".input-container").style.border = "";
  mortageTerm.closest(".input-container").style.border = "";

  e.preventDefault();
  let amountValue = mortageAmount.value;
  let duration = mortageTerm.value;
  let rateValue = mortageRate.value;
  let mortageType = document.querySelector('input[name="mortageType"]:checked');

  let valid = true;

  if (!amountValue) {
    document.getElementById("error-amount").textContent =
      "This field is required";
    mortageAmount.closest(".input-container").style.border = "2px solid red";
    valid = false;
  }

  if (!rateValue) {
    document.getElementById("error-rate").textContent =
      "This field is required";
    mortageRate.closest(".input-container").style.border = "2px solid red";
    valid = false;
  }

  if (!duration) {
    document.getElementById("error-duration").textContent =
      "This field is required";
    mortageTerm.closest(".input-container").style.border = "2px solid red";
    valid = false;
  }

  if (!mortageType) {
    document.getElementById("error-type").textContent =
      "This field is required";
    valid = false;
  }

  if (!valid) {
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
           <p id="monthlyRepaymentsResult">${(
             monthlyPayment * 1
           ).toLocaleString("en-GB", {
             style: "currency",
             currency: "GBP",
           })}</p>
            </div>
            <div class="bottom-part">
            <h3>Total you'll repay over the term</h3>
            <p id="totalDueOverTerm">${(
              monthlyPayment *
              12 *
              duration
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</p>
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
            <p id="monthlyRepaymentsResult"> ${(
              monthlyInterest * 1
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</p>
            </div>
            <div class="bottom-part">
            <h3>Total you'll repay over the term</h3>
            <p id="totalDueOverTerm">${(
              monthlyInterest *
              12 *
              duration
            ).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</p>
            </div>
            </div>
            </div>
            `;
    }
  }
});

//Clear inputs
const resetInputs = (e) => {
  mortageAmount.value = "";
  mortageTerm.value = "";
  mortageRate.value = "";
  interestRadio.checked = false;
  repaymentRadio.checked = false;
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
