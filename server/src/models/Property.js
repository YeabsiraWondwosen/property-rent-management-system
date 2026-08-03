import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
  {
    type: String,
  },
],

    description: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Commercial", "Studio"],
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;