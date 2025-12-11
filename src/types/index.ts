import { Request, Response, NextFunction } from 'express';

// Shipment status types
export const SHIPMENT_STATUSES = ['pending', 'in_transit', 'delivered', 'cancelled'] as const;
export type ShipmentStatus = typeof SHIPMENT_STATUSES[number];

// Shipment interface
export interface IShipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Create shipment DTO
export interface CreateShipmentDTO {
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status?: ShipmentStatus;
}

// Update shipment DTO
export interface UpdateShipmentDTO {
  trackingNumber?: string;
  senderName?: string;
  receiverName?: string;
  origin?: string;
  destination?: string;
  status?: ShipmentStatus;
}

// Query parameters for getting shipments
export interface GetShipmentsQuery {
  page?: string;
  limit?: string;
  status?: ShipmentStatus;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

// Config interface
export interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  shipmentStatuses: readonly ShipmentStatus[];
  defaultStatus: ShipmentStatus;
}

// Extended Request type for validated requests
export interface ValidatedRequest<T = unknown> extends Request {
  body: T;
}

// Async handler type
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Error with additional properties
export interface MongooseError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  errors?: Record<string, { path: string; message: string }>;
}

