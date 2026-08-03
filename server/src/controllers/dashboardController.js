import Property from "../models/Property.js";
import User from "../models/User.js";
import Lease from "../models/Lease.js";
import Payment from "../models/Payment.js";

/**
 * Dashboard Statistics
 * GET /api/dashboard
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();

    const availableProperties = await Property.countDocuments({
      isAvailable: true,
    });

    const occupiedProperties = await Property.countDocuments({
      isAvailable: false,
    });

    const totalUsers = await User.countDocuments();

    const totalLeases = await Lease.countDocuments();

    const activeLeases = await Lease.countDocuments({
      status: "Active",
    });

    const totalPayments = await Payment.countDocuments();

    const pendingPayments = await Payment.countDocuments({
      status: "Pending",
    });

    const revenue = await Payment.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0 ? revenue[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      statistics: {
        totalProperties,
        availableProperties,
        occupiedProperties,
        totalUsers,
        totalLeases,
        activeLeases,
        totalPayments,
        pendingPayments,
        totalRevenue,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};