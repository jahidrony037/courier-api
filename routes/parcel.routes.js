import express from 'express';
import {
    cancelParcel,
    createParcelBooking,
    getAllParcels,
    getAssignedParcels,
    getBookingHistory,
    getUserParcels,
    optimizedRoute,
    trackParcel,
    updateParcelStatus
} from '../controllers/parcel.controller.js';
import { isAdmin, isAgent, isCustomer } from '../middlewares/roleMiddleware.js';

import verifyToken from '../middlewares/authMiddleware.js';


const router = express.Router();

// Fetch parcels for the logged-in customer
router.get('/user-parcels', verifyToken, getUserParcels); 

// Other routes
router.post('/book', verifyToken, isCustomer, createParcelBooking);
router.get('/track/:parcelId', verifyToken, isCustomer, trackParcel); // For customers
router.get('/track/:parcelId', verifyToken, isAdmin, trackParcel); // For admins
router.get('/history', verifyToken, isCustomer, getBookingHistory); // No need for customerId in URL
router.put('/cancel', verifyToken, isCustomer, cancelParcel);
router.get('/parcels', verifyToken, isAdmin, getAllParcels);
router.get('/assigned', verifyToken, isAgent, getAssignedParcels); 
router.put('/update-status', verifyToken, isAgent, updateParcelStatus); 
router.post('/optimized-route', verifyToken, isAgent, optimizedRoute); 

export default router;
