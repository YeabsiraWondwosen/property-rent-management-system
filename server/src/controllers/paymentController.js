import Payment from "../models/Payment.js";
import Lease from "../models/Lease.js";

/**
 * Create Payment
 *
 * Admin / Owner
 *
 * POST /api/payments
 */
export const createPayment = async (req, res) => {
  try {
    const {
      lease,
      amount,
      paymentMethod,
      paymentDate,
      status,
      note,
    } = req.body;

    if (!lease || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Lease, amount and payment method are required.",
      });
    }

    const existingLease = await Lease.findById(lease);

    if (!existingLease) {
      return res.status(404).json({
        success: false,
        message: "Lease not found.",
      });
    }

    const payment = await Payment.create({
      lease,
      amount,
      paymentMethod,
      paymentDate,
      status,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully.",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Payments
 *
 * Admin / Owner:
 *    All payments
 *
 * Tenant:
 *    Only payments belonging to their leases
 *
 * GET /api/payments
 */
export const getPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === "tenant") {
      const leases = await Lease.find({
        tenant: req.user._id,
      }).select("_id");

      const leaseIds = leases.map((lease) => lease._id);

      payments = await Payment.find({
        lease: { $in: leaseIds },
      })
        .populate({
          path: "lease",
          populate: [
            {
              path: "tenant",
              select: "fullName email",
            },
            {
              path: "property",
              select: "title city",
            },
          ],
        })
        .sort({ createdAt: -1 });
    } else {
      payments = await Payment.find()
        .populate({
          path: "lease",
          populate: [
            {
              path: "tenant",
              select: "fullName email",
            },
            {
              path: "property",
              select: "title city",
            },
          ],
        })
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Payment By ID
 *
 * GET /api/payments/:id
 */
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "lease",
        populate: [
          {
            path: "tenant",
            select: "fullName email",
          },
          {
            path: "property",
            select: "title city",
          },
        ],
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (
      req.user.role === "tenant" &&
      payment.lease.tenant._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own payments.",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Payment
 *
 * Admin / Owner only
 *
 * PUT /api/payments/:id
 */
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Payment updated successfully.",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Payment
 *
 * Admin / Owner only
 *
 * DELETE /api/payments/:id
 */
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};