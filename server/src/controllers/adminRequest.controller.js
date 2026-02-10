import Request from "../models/Request.js";

/**
 * @desc    Get all medicine requests
 * @route   GET /api/requests
 * @access  Admin
 */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("userId", "name email")
      .populate("medicineId", "name prescriptionRequired price")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update request status
 * @route   PUT /api/requests/:id
 * @access  Admin
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
