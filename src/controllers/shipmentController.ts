import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import Shipment from '../models/Shipment';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import { successResponse, paginatedResponse } from '../utils/responseFormatter';
import { GetShipmentsQuery, CreateShipmentDTO, UpdateShipmentDTO } from '../types';

/**
 * @desc    Get all shipments with optional pagination and filtering
 * @route   GET /api/shipments
 * @access  Public
 */
export const getAllShipments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      page = '1',
      limit = '10',
      status,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query as GetShipmentsQuery;

    // Build query
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder: SortOrder = order === 'asc' ? 1 : -1;
    const sort: Record<string, SortOrder> = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [shipments, total] = await Promise.all([
      Shipment.find(query).sort(sort).skip(skip).limit(limitNum),
      Shipment.countDocuments(query),
    ]);

    res.status(200).json(paginatedResponse(shipments, pageNum, limitNum, total));
  }
);

/**
 * @desc    Get a single shipment by ID
 * @route   GET /api/shipments/:id
 * @access  Public
 */
export const getShipmentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);

    if (!shipment) {
      throw ApiError.notFound(`Shipment with ID ${id} not found`);
    }

    res.status(200).json(successResponse(shipment, 'Shipment retrieved successfully'));
  }
);

/**
 * @desc    Create a new shipment
 * @route   POST /api/shipments
 * @access  Public
 */
export const createShipment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const shipmentData = req.body as CreateShipmentDTO;
    const shipment = await Shipment.create(shipmentData);

    res.status(201).json(successResponse(shipment, 'Shipment created successfully'));
  }
);

/**
 * @desc    Update a shipment by ID
 * @route   PUT /api/shipments/:id
 * @access  Public
 */
export const updateShipment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body as UpdateShipmentDTO;
    const shipment = await Shipment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!shipment) {
      throw ApiError.notFound(`Shipment with ID ${id} not found`);
    }

    res.status(200).json(successResponse(shipment, 'Shipment updated successfully'));
  }
);

/**
 * @desc    Delete a shipment by ID
 * @route   DELETE /api/shipments/:id
 * @access  Public
 */
export const deleteShipment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const shipment = await Shipment.findByIdAndDelete(id);

    if (!shipment) {
      throw ApiError.notFound(`Shipment with ID ${id} not found`);
    }

    res.status(200).json(successResponse(null, 'Shipment deleted successfully'));
  }
);

