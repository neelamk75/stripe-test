var createCheckoutSession = function(priceId) {
    return fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        priceId: priceId
      })
    }).then(function(result) {
      return result.json();
    });
  };

const PREMIUM_PRICE_ID = "price_1PbFclK2DfOCA6g0gaPn0wpA";
const BASIC_PRICE_ID = "price_1PbFbSK2DfOCA6g0qSqQuuMq";
const stripe = Stripe("pk_live_51NOOWrK2DfOCA6g0n8AucUgNicO0w7xQojPEySoxmlbpxL3kFZt1cTfPzh8en0REcFo2eHakffpCQatvJ9v8kYT2002loItcES");

document.addEventListener("DOMContentLoaded", function(event) {
    document
    .getElementById("checkout-premium")
    .addEventListener("click", function(evt) {
        createCheckoutSession(PREMIUM_PRICE_ID).then(function(data) {
            stripe
                .redirectToCheckout({
                    sessionId: data.sessionId
                });
            });
        });
    
    document
    .getElementById("checkout-basic")
    .addEventListener("click", function(evt) {
        createCheckoutSession(BASIC_PRICE_ID).then(function(data) {
            stripe
                .redirectToCheckout({
                    sessionId: data.sessionId
                });
            });
        });

    const billingButton = document.getElementById("manage-billing");
    if (billingButton) {
        billingButton.addEventListener("click", function(evt) {
        fetch("/create-portal-session", {
            method: "POST"
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(data) {
                window.location.href = data.url;
            });
        })
    }
});