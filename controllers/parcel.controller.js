import Parcel from '../models/Parcel.model.js';
import { io } from '../server.js';
import { getOptimizedRoute } from '../utils/googleMaps.service.js';

export const createParcelBooking = async (req, res) => {
  const { pickupAddress, deliveryAddress, parcelType, weight, customerId, latitude, longitude } = req.body;

  try {
    const newParcel = new Parcel({
      pickupAddress,
      deliveryAddress,
      parcelType,
      weight,
      customerId,
      latitude, // Save latitude
      longitude, // Save longitude
    });

    const savedParcel = await newParcel.save();
    res.status(201).json({
      message: "Parcel booked successfully",
      parcel: savedParcel,
      success: true,
    });
  } catch (error) {
    console.error("Error booking parcel:", error);
    res.status(500).json({ message: "Failed to book parcel", error: error.message });
  }
};


export const getAllParcels = async (req, res)=> {
    try {
        const parcels = await Parcel.find().populate('customerId', 'name email').populate('agentId', 'name email');
        res.status(200).json(parcels);
    }catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).json({ message: "Failed to fetch parcels", error: error.message });
    }
}


export const getUserParcels = async (req, res) => {
  const customerId = req.user.id; 
  
  try {
    const parcels = await Parcel.find({ customerId }).populate('customerId', 'name email');
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parcels", error: error.message });
  }
};



export const getBookingHistory = async (req, res) => {
  const customerId = req.user._id;  // Get customer ID from the authenticated user (JWT token)
  console.log('Fetching booking history for customer ID:', customerId);

  try {
    const parcels = await Parcel.find({ customerId }).populate('customerId', 'name email');
    
    if (!parcels || parcels.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this customer.' });
    }
    
    res.status(200).json(parcels);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ message: "Failed to fetch booking history", error: error.message });
  }
};




export const updateParcelStatus = async (req, res) => {
  const { parcelId, status } = req.body;

  try {
    const parcel = await Parcel.findByIdAndUpdate(parcelId, { status }, { new: true });
    io.emit('parcelStatusUpdate', { parcelId, status: parcel.status });  
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const trackParcel = async (req, res) => {
  const { parcelId } = req.params;

  try {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const cancelParcel = async (req, res) => {
  const { parcelId } = req.body;

  try {
    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    // Check if the parcel is already delivered or cancelled
    if (parcel.status === 'Delivered' || parcel.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot cancel a parcel that is already delivered or cancelled' });
    }

    // Update the status to 'Cancelled'
    parcel.status = 'Cancelled';
    await parcel.save();

    res.status(200).json({ message: 'Parcel cancelled successfully', parcel });
  } catch (error) {
    console.error('Error cancelling parcel:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAssignedParcels = async (req, res) => {
  const agentId = req.user.id; // Assume user ID is available in req.user (from token)

  try {
    const parcels = await Parcel.find({ deliveryAgent: agentId }).populate('deliveryAgent', 'name email');
    res.status(200).json(parcels); // Return parcels assigned to the agent
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned parcels', error: error.message });
  }
};


 // Import the service

export const optimizedRoute = async (req, res) => {
  const { origin, destination } = req.body;  // Expecting origin and destination from request body
  
  try {
    const route = await getOptimizedRoute(origin, destination);  // Call the service to get the route
    res.status(200).json(route);  // Return the optimized route to the client
  } catch (error) {
    res.status(500).json({ message: 'Error fetching optimized route', error: error.message });
  }
};


