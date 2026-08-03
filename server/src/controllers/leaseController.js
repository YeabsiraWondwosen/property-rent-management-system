import Lease from "../models/Lease.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

/**
 * Create Lease
 * POST /api/leases
 */
export const createLease = async (req, res) => {
  try {
    const {
      property,
      tenant,
      startDate,
      endDate,
      monthlyRent,
      deposit,
    } = req.body;

    if (
      !property ||
      !tenant ||
      !startDate ||
      !endDate ||
      !monthlyRent
    ) {
      return res.status(400).json({
        success: false,
        message: "All required lease fields must be provided.",
      });
    }

    const existingProperty = await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const existingTenant = await User.findById(tenant);

    if (!existingTenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found.",
      });
    }

    if (existingTenant.role !== "tenant") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a tenant.",
      });
    }

    const lease = await Lease.create({
      property,
      tenant,
      startDate,
      endDate,
      monthlyRent,
      deposit,
    });

    await Property.findByIdAndUpdate(property, {
      isAvailable: false,
    });

    res.status(201).json({
      success: true,
      message: "Lease created successfully.",
      lease,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Leases
 *
 * Admin / Owner:
 *    Get all leases
 *
 * Tenant:
 *    Get only their own leases
 *
 * GET /api/leases
 */
export const getLeases = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "tenant") {
      query.tenant = req.user._id;
    }

    const leases = await Lease.find(query)
      .populate("property")
      .populate("tenant", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leases.length,
      leases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Lease By ID
 *
 * Tenant can only access their own lease.
 *
 * GET /api/leases/:id
 */
export const getLeaseById = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id)
      .populate("property")
      .populate("tenant", "fullName email");

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: "Lease not found.",
      });
    }

    if (
      req.user.role === "tenant" &&
      lease.tenant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own lease.",
      });
    }

    res.status(200).json({
      success: true,
      lease,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Lease
 * PUT /api/leases/:id
 */
export const updateLease = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: "Lease not found.",
      });
    }

    const updatedLease = await Lease.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("property")
      .populate("tenant", "fullName email");

    res.status(200).json({
      success: true,
      message: "Lease updated successfully.",
      lease: updatedLease,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Lease
 * DELETE /api/leases/:id
 */
export const deleteLease = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: "Lease not found.",
      });
    }

    await lease.deleteOne();

    await Property.findByIdAndUpdate(lease.property, {
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      message: "Lease deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};