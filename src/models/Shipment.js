const mongoose = require("mongoose");
const config = require("../config");

/**
 * Shipment Schema Definition
 * Represents a shipment with tracking information
 */
const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: [true, "Tracking number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
      minlength: [2, "Sender name must be at least 2 characters"],
      maxlength: [100, "Sender name cannot exceed 100 characters"],
    },
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
      trim: true,
      minlength: [2, "Receiver name must be at least 2 characters"],
      maxlength: [100, "Receiver name cannot exceed 100 characters"],
    },
    origin: {
      type: String,
      required: [true, "Origin is required"],
      trim: true,
      minlength: [2, "Origin must be at least 2 characters"],
      maxlength: [200, "Origin cannot exceed 200 characters"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      minlength: [2, "Destination must be at least 2 characters"],
      maxlength: [200, "Destination cannot exceed 200 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: config.shipmentStatuses,
        message:
          "Status must be one of: pending, in_transit, delivered, cancelled",
      },
      default: config.defaultStatus,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for common queries
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ createdAt: -1 });

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
