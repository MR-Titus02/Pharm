import Request from "../models/Request.js";

/**
 * @desc    Get all medicine requests with pagination
 * @route   GET /api/requests?page=1&limit=10&status=pending
 * @access  Admin
 */
export const getAllRequests = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    
    const filterQuery = {};
    if (req.query.status && ["pending", "approved", "rejected"].includes(req.query.status)) {
      filterQuery.status = req.query.status;
    }

    const total = await Request.countDocuments(filterQuery);
    const requests = await Request.find(filterQuery)
      .populate("userId", "name email")
      .populate("medicineId", "name prescriptionRequired price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
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

/**
 * @desc    Update request status (approved/rejected)
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

/**
 * @desc    Update request delivery status
 * @route   PUT /api/requests/:id/delivery
 * @access  Admin
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, deliveryNotes } = req.body;

    if (!["pending", "shipped", "delivered", "cancelled"].includes(deliveryStatus)) {
      return res.status(400).json({
        message: "Delivery status must be pending, shipped, delivered, or cancelled",
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.deliveryStatus = deliveryStatus;
    if (deliveryNotes) {
      request.deliveryNotes = deliveryNotes;
    }
    if (deliveryStatus === "delivered") {
      request.deliveryDate = Date.now();
    }
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
