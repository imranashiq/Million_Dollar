const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Get available cryptocurrencies
router.get("/currencies", paymentController.getAvailableCurrencies);

// Create a new invoice
router.post("/invoice", paymentController.createInvoice);

// Get invoice status
router.get("/invoice/:invoiceId", paymentController.getInvoiceStatus);

// Get all invoices
router.get("/invoices", paymentController.getAllInvoices);

// Get minimum payment amount
router.get("/min-amount", paymentController.getMinimumPaymentAmount);

// Webhook endpoint for payment notifications
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
