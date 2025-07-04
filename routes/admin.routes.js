
import express from 'express';
import {
    assignAgentToParcel,
    exportReports,
    getAllParcels,
    getAllUsers,
    getDashboardMetrics,
} from '../controllers/admin.controller.js';
import verifyToken from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Define Admin Routes
router.get('/users',verifyToken,isAdmin, getAllUsers);  
router.get('/parcels', getAllParcels);  
router.put('/assign-agent', assignAgentToParcel);  
router.get('/export-reports/:type', exportReports);  
router.get('/dashboard-metrics', getDashboardMetrics);  

export default router;
