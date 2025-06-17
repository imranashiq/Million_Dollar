const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    token_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    order_description: {
      type: String,
      default: null,
    },
    price_amount: {
      type: String,
      required: true,
    },
    price_currency: {
      type: String,
      required: true,
    },
    pay_currency: {
      type: String,
      default: null,
    },
    ipn_callback_url: {
      type: String,
      required: true,
    },
    invoice_url: {
      type: String,
      required: true,
    },
    success_url: {
      type: String,
      required: true,
    },
    cancel_url: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      default: null,
    },
    partially_paid_url: {
      type: String,
      default: null,
    },
    payout_currency: {
      type: String,
      default: null,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
    is_fixed_rate: {
      type: Boolean,
      default: false,
    },
    is_fee_paid_by_user: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: null,
    },
    collect_user_data: {
      type: Boolean,
      default: false,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "expired", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
