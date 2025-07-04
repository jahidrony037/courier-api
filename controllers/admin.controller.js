import { Parser } from 'json2csv';
import Parcel from '../models/Parcel.model.js';
import User from "../models/User.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate('customerId').populate('agentId');  
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parcels", error: error.message });
  }
};

export const assignAgentToParcel = async (req, res) => {
  const { parcelId, agentId } = req.body;

  try {
    const parcel = await Parcel.findById(parcelId);
    const agent = await User.findById(agentId);
    
    if (!parcel || !agent) {
      return res.status(404).json({ message: "Parcel or agent not found." });
    }

    // Assign agent to parcel
    parcel.agentId = agentId;
    await parcel.save();

    res.status(200).json({ message: "Agent assigned successfully", parcel });
  } catch (error) {
    res.status(500).json({ message: "Error assigning agent", error: error.message });
  }
};

// controllers/admin.controller.js


export const exportReports = async (req, res) => {
  const { type } = req.params;  // "csv" or "pdf"
  
  try {
    const parcels = await Parcel.find();  // Get all parcels

    if (type === "csv") {
      const parser = new Parser();
      const csv = parser.parse(parcels);  // Convert JSON to CSV
      res.header("Content-Type", "text/csv");
      res.attachment("parcels_report.csv");
      res.send(csv);
    } else if (type === "pdf") {
      // You can use jsPDF or any other library to generate a PDF
      const doc = new jsPDF();
      doc.text("Parcel Report", 10, 10);
      // Add more content here for PDF
      res.header("Content-Type", "application/pdf");
      res.send(doc.output());
    } else {
      res.status(400).json({ message: "Invalid report type" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error exporting reports", error: error.message });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    // Metrics
    const dailyBookings = await Parcel.find({
      bookingDate: { $gte: new Date().setHours(0, 0, 0, 0) }, // Bookings today
    });

    const failedDeliveries = await Parcel.find({ status: "Failed" });
    const codAmount = await Parcel.aggregate([
      { $match: { paymentType: "COD" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      dailyBookings: dailyBookings.length,
      failedDeliveries: failedDeliveries.length,
      codAmount: codAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching metrics", error: error.message });
  }
};

