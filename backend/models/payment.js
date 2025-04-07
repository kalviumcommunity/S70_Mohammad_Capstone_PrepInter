const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ["created", "completed", "failed"], default: "created" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
