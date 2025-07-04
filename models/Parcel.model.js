import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema(
  {
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    parcelType: { type: String, required: true },
    weight: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Booked', 'Picked Up', 'In Transit', 'Delivered', 'Failed', 'Cancelled'],
      default: 'Booked',
    },
    bookingDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    latitude: { type: Number, required: true },  // Latitude of delivery address
    longitude: { type: Number, required: true }, // Longitude of delivery address
  },
  { timestamps: true }
);

export default mongoose.model('Parcel', parcelSchema, 'parcels');
