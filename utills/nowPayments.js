const axios = require("axios");
require("dotenv").config();

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

const nowPaymentsClient = axios.create({
  baseURL: NOWPAYMENTS_API_URL,
  headers: {
    "x-api-key": NOWPAYMENTS_API_KEY,
    "Content-Type": "application/json",
  },
});

const nowPayments = {
  // Get available currencies
  getAvailableCurrencies: async () => {
    try {
      const response = await nowPaymentsClient.get("/currencies");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get currencies: ${error.message}`);
    }
  },

  // Create an invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await nowPaymentsClient.post("/invoice", invoiceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  },

  // Get invoice status
  getInvoiceStatus: async (invoiceId) => {
    try {
      const response = await nowPaymentsClient.get(`/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get invoice status: ${error.message}`);
    }
  },

  // Get minimum payment amount
  getMinimumPaymentAmount: async (currencyFrom, currencyTo) => {
    try {
      const response = await nowPaymentsClient.get("/min-amount", {
        params: {
          currency_from: currencyFrom,
          currency_to: currencyTo,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get minimum payment amount: ${error.message}`);
    }
  },
};

module.exports = nowPayments;
