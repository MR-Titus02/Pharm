import User from "../models/User.js";
import Medicine from "../models/Medicine.js";
import Request from "../models/Request.js";

/**
 * @desc    Get dashboard stats
 * @route   GET /api/reports/dashboard
 * @access  Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const totalRequests = await Request.countDocuments();

    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const approvedRequests = await Request.countDocuments({ status: "approved" });

    const lowStockMedicines = await Medicine.countDocuments({ stock: { $lt: 10 } });

    res.json({
      users: { total: totalUsers },
      medicines: { total: totalMedicines, lowStock: lowStockMedicines },
      requests: { total: totalRequests, pending: pendingRequests, approved: approvedRequests },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
