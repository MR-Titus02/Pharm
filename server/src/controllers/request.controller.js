import Request from "../models/Request.js";
import Medicine from "../models/Medicine.js";

/**
 * @desc    Create medicine request
 * @route   POST /api/requests
 * @access  User
 */
export const createRequest = async (req, res) => {
  try {
    const { medicineId } = req.body;

    if (!medicineId) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // If prescription required → file must exist
    if (medicine.prescriptionRequired && !req.file) {
      return res.status(400).json({
        message: "Prescription file is required for this medicine",
      });
    }

    const request = await Request.create({
      userId: req.user._id,
      medicineId,
      prescriptionFile: medicine.prescriptionRequired
        ? `/uploads/${req.file.filename}`
        : null,
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's requests
 * @route   GET /api/requests/user
 * @access  User
 */
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .populate("medicineId", "name price prescriptionRequired")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};