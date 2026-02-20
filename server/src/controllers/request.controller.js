import Request from "../models/Request.js";
import Medicine from "../models/Medicine.js";

/**
 * @desc    Create medicine request
 * @route   POST /api/requests
 * @access  User
 */
export const createRequest = async (req, res) => {
  try {
    const { medicineId, nicFile } = req.body;

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

    if (!nicFile) {
      return res.status(400).json({
        message: "NIC document is required for request verification",
      });
    }

    const request = await Request.create({
      userId: req.user._id,
      medicineId,
      nicFile,
      prescriptionFile: medicine.prescriptionRequired
        ? `/uploads/${req.file.filename}`
        : null,
      // Auto-approve non-prescription medicines, require approval for prescription medicines
      status: medicine.prescriptionRequired ? "pending" : "approved",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's requests with pagination
 * @route   GET /api/requests/user?page=1&limit=10
 * @access  User
 */
export const getUserRequests = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const total = await Request.countDocuments({ userId: req.user._id });
    const requests = await Request.find({ userId: req.user._id })
      .populate("medicineId", "name price prescriptionRequired")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};