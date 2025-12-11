import dotenv from 'dotenv';
import { Config, SHIPMENT_STATUSES, ShipmentStatus } from '../types';

dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shipment_db',
  shipmentStatuses: SHIPMENT_STATUSES,
  defaultStatus: 'pending' as ShipmentStatus,
};

export default config;

