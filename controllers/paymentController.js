const nowPayments = require("../utills/nowPayments");
const Invoice = require("../models/invoice");

// Function to generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${random}`;
};

const paymentController = {
  // Get available cryptocurrencies
  getAvailableCurrencies: async (req, res) => {
    try {
      const currencies = await nowPayments.getAvailableCurrencies();
      res.json({ success: true, data: currencies });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create a new invoice
  createInvoice: async (req, res) => {
    try {
      const {
        price_amount,
        price_currency,
        ipn_callback_url,
        success_url,
        cancel_url,
        customer_email,
        partially_paid_url,
        payout_currency,
        is_fixed_rate,
        is_fee_paid_by_user,
        collect_user_data,
      } = req.body;

      if (!price_amount || !price_currency) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: price_amount and price_currency are required",
        });
      }

      const invoiceData = {
        price_amount,
        price_currency,
        order_id: generateOrderId(),
        ipn_callback_url:
          ipn_callback_url || `${process.env.BASE_URL}/api/payments/webhook`,
        success_url: success_url || `${process.env.BASE_URL}/payment/success`,
        cancel_url: cancel_url || `${process.env.BASE_URL}/payment/cancel`,
        customer_email: customer_email || null,
        partially_paid_url: partially_paid_url || null,
        payout_currency: payout_currency || null,
        is_fixed_rate: is_fixed_rate || false,
        is_fee_paid_by_user: is_fee_paid_by_user || false,
        collect_user_data: collect_user_data || false,
      };

      const invoice = await nowPayments.createInvoice(invoiceData);

      // Save invoice to database
      const savedInvoice = await Invoice.create({
        id: invoice.id,
        token_id: invoice.token_id,
        order_id: invoice.order_id,
        order_description: invoice.order_description || null,
        price_amount: invoice.price_amount,
        price_currency: invoice.price_currency,
        pay_currency: invoice.pay_currency || null,
        ipn_callback_url: invoice.ipn_callback_url,
        invoice_url: invoice.invoice_url,
        success_url: invoice.success_url,
        cancel_url: invoice.cancel_url,
        customer_email: invoice.customer_email || null,
        partially_paid_url: invoice.partially_paid_url || null,
        payout_currency: invoice.payout_currency || null,
        created_at: invoice.created_at,
        updated_at: invoice.updated_at,
        is_fixed_rate: invoice.is_fixed_rate || false,
        is_fee_paid_by_user: invoice.is_fee_paid_by_user || false,
        source: invoice.source || null,
        collect_user_data: invoice.collect_user_data || false,
        payment_status: "pending",
      });

      res.json(savedInvoice);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get invoice status
  getInvoiceStatus: async (req, res) => {
    try {
      const { invoiceId } = req.params;

      // First check our database
      const localInvoice = await Invoice.findOne({ id: invoiceId });
      if (!localInvoice) {
        return res
          .status(404)
          .json({ success: false, error: "Invoice not found" });
      }

      // Get latest status from NowPayments
      const nowPaymentsStatus = await nowPayments.getInvoiceStatus(invoiceId);

      // Update local invoice status if it has changed
      if (nowPaymentsStatus.payment_status !== localInvoice.payment_status) {
        localInvoice.payment_status = nowPaymentsStatus.payment_status;
        await localInvoice.save();
      }

      res.json(localInvoice);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get minimum payment amount
  getMinimumPaymentAmount: async (req, res) => {
    try {
      const { currencyFrom, currencyTo } = req.query;

      if (!currencyFrom || !currencyTo) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required query parameters: currencyFrom and currencyTo",
        });
      }

      const minAmount = await nowPayments.getMinimumPaymentAmount(
        currencyFrom,
        currencyTo
      );
      res.json(minAmount);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Handle IPN (Instant Payment Notification) webhook
  handleWebhook: async (req, res) => {
    try {
      const webhookData = req.body;

      // Verify the webhook signature if provided
      // Add your webhook verification logic here

      // Update invoice status in database
      const invoice = await Invoice.findOne({ id: webhookData.id });
      if (invoice) {
        invoice.payment_status = webhookData.payment_status;
        await invoice.save();
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get all invoices
  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ created_at: -1 });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = paymentController;
