import mongoose, { Schema, Document, Model } from 'mongoose';
import config from '../config';
import { ShipmentStatus } from '../types';

// Document interface for Mongoose
export interface IShipmentDocument extends Document {
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Shipment Schema Definition
 * Represents a shipment with tracking information
 */
const shipmentSchema = new Schema<IShipmentDocument>(
  {
    trackingNumber: {
      type: String,
      required: [true, 'Tracking number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      minlength: [2, 'Sender name must be at least 2 characters'],
      maxlength: [100, 'Sender name cannot exceed 100 characters'],
    },
    receiverName: {
      type: String,
      required: [true, 'Receiver name is required'],
      trim: true,
      minlength: [2, 'Receiver name must be at least 2 characters'],
      maxlength: [100, 'Receiver name cannot exceed 100 characters'],
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
      minlength: [2, 'Origin must be at least 2 characters'],
      maxlength: [200, 'Origin cannot exceed 200 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      minlength: [2, 'Destination must be at least 2 characters'],
      maxlength: [200, 'Destination cannot exceed 200 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: config.shipmentStatuses as unknown as string[],
        message: 'Status must be one of: pending, in_transit, delivered, cancelled',
      },
      default: config.defaultStatus,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
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

const Shipment: Model<IShipmentDocument> = mongoose.model<IShipmentDocument>(
  'Shipment',
  shipmentSchema
);

export default Shipment;

