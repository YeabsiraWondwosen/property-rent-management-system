import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lease",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Mobile Money"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Late"],
      default: "Paid",
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;