import Property from "../models/Property.js";

/**
 * Create Property
 */
export const createProperty = async (req, res) => {
  try {
    const images = [];

    if (req.files) {
      req.files.forEach((file) => {
        images.push(file.filename);
      });
    }

    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      images,
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

/**
 * Get All Properties
 */
export const getProperties = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Search by title
    if (req.query.title) {
      query.title = {
        $regex: req.query.title,
        $options: "i",
      };
    }

    // Search by city
    if (req.query.city) {
      query.city = {
        $regex: req.query.city,
        $options: "i",
      };
    }

    // Filter by property type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter availability
    if (req.query.available) {
      query.isAvailable = req.query.available === "true";
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    let sort = { createdAt: -1 };

    switch (req.query.sort) {

      case "price_asc":
        sort = { price: 1 };
        break;

      case "price_desc":
        sort = { price: -1 };
        break;

      case "oldest":
        sort = { createdAt: 1 };
        break;

      case "newest":
        sort = { createdAt: -1 };
        break;

      default:
        sort = { createdAt: -1 };
    }

    const properties = await Property.find(query)
      .populate("owner", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProperties: total,
      properties,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Get Property By ID
 */
export const getPropertyById = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id)
      .populate("owner", "fullName email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Update Property
 */
export const updateProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property: updatedProperty,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Delete Property
 */
export const deleteProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};