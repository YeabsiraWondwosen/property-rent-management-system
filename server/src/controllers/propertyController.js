import Property from "../models/Property.js";

/**
 * Create Property
 * POST /api/properties
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      address,
      city,
      rentPrice,
      bedrooms,
      bathrooms,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !propertyType ||
      !address ||
      !city ||
      !rentPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const property = await Property.create({
      title,
      description,
      propertyType,
      address,
      city,
      rentPrice,
      bedrooms,
      bathrooms,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};