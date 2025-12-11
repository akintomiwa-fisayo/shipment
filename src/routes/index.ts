import express, { Request, Response } from 'express';
import shipmentRoutes from './shipmentRoutes';

const router = express.Router();

// API Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Shipment API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount shipment routes
router.use('/shipments', shipmentRoutes);

export default router;

