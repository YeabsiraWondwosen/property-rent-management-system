import Maintenance from "../models/Maintenance.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

/**
 * Create Maintenance Request
 *
 * Admin / Owner / Tenant
 */
export const createMaintenance = async (req, res) => {
  try {
    const {
      property,
      title,
      description,
      priority,
    } = req.body;

    if (!property || !title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Property, title and description are required.",
      });
    }

    const existingProperty =
      await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const tenant = await User.findById(req.user._id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const maintenance = await Maintenance.create({
      property,
      tenant: req.user._id,
      title,
      description,
      priority,
    });

    res.status(201).json({
      success: true,
      message:
        "Maintenance request created successfully.",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Maintenance Requests
 *
 * Admin / Owner:
 *    All requests
 *
 * Tenant:
 *    Only their own requests
 */
export const getMaintenanceRequests = async (
  req,
  res
) => {
  try {
    let query = {};

    if (req.user.role === "tenant") {
      query.tenant = req.user._id;
    }

    const maintenanceRequests =
      await Maintenance.find(query)
        .populate(
          "property",
          "title city address"
        )
        .populate(
          "tenant",
          "fullName email"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: maintenanceRequests.length,
      maintenanceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Maintenance Request By ID
 */
export const getMaintenanceById = async (
  req,
  res
) => {
  try {
    const maintenance =
      await Maintenance.findById(req.params.id)
        .populate(
          "property",
          "title city address"
        )
        .populate(
          "tenant",
          "fullName email"
        );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message:
          "Maintenance request not found.",
      });
    }

    if (
      req.user.role === "tenant" &&
      maintenance.tenant._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only access your own maintenance requests.",
      });
    }

    res.status(200).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Maintenance Request
 *
 * Admin / Owner only
 */
export const updateMaintenance = async (
  req,
  res
) => {
  try {
    const maintenance =
      await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message:
          "Maintenance request not found.",
      });
    }

    const updatedMaintenance =
      await Maintenance.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "property",
          "title city address"
        )
        .populate(
          "tenant",
          "fullName email"
        );

    res.status(200).json({
      success: true,
      message:
        "Maintenance request updated successfully.",
      maintenance: updatedMaintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Maintenance Request
 *
 * Admin / Owner only
 */
export const deleteMaintenance = async (
  req,
  res
) => {
  try {
    const maintenance =
      await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message:
          "Maintenance request not found.",
      });
    }

    await maintenance.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Maintenance request deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};