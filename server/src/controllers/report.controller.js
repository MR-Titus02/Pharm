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

/**
 * @desc    Get user statistics
 * @route   GET /api/reports/user-stats
 * @access  User
 */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Request stats
    const totalRequests = await Request.countDocuments({ userId });
    const pendingRequests = await Request.countDocuments({ userId, status: "pending" });
    const approvedRequests = await Request.countDocuments({ userId, status: "approved" });
    const rejectedRequests = await Request.countDocuments({ userId, status: "rejected" });

    // Payment stats
    const paidRequests = await Request.countDocuments({ userId, paymentStatus: "paid" });
    const pendingPaymentRequests = await Request.countDocuments({
      userId,
      status: "approved",
      paymentStatus: "pending",
    });

    // Calculate total spent
    const paidOrders = await Request.find({ userId, paymentStatus: "paid" }).populate(
      "medicineId",
      "price"
    );
    const totalSpent = paidOrders.reduce((sum, order) => sum + (order.medicineId?.price || 0), 0);
    const pendingPaymentAmount = await Request.aggregate([
      { $match: { userId, status: "approved", paymentStatus: "pending" } },
      {
        $lookup: {
          from: "medicines",
          localField: "medicineId",
          foreignField: "_id",
          as: "medicine",
        },
      },
      { $unwind: "$medicine" },
      { $group: { _id: null, total: { $sum: "$medicine.price" } } },
    ]);

    // Delivery stats
    const shippedRequests = await Request.countDocuments({
      userId,
      deliveryStatus: "shipped",
    });
    const deliveredRequests = await Request.countDocuments({
      userId,
      deliveryStatus: "delivered",
    });

    res.json({
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
      },
      payments: {
        totalPaid: paidRequests,
        totalSpent,
        pending: pendingPaymentAmount[0]?.total || 0,
      },
      delivery: {
        shipped: shippedRequests,
        delivered: deliveredRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get admin reports
 * @route   GET /api/reports/admin
 * @access  Admin
 */
export const getAdminReports = async (req, res) => {
  try {
    // Payment stats
    const paidRequests = await Request.find({ paymentStatus: "paid" }).populate(
      "medicineId",
      "price"
    );
    const totalRevenue = paidRequests.reduce((sum, order) => sum + (order.medicineId?.price || 0), 0);
    const totalTransactions = paidRequests.length;

    // Request stats
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const approvedRequests = await Request.countDocuments({ status: "approved" });
    const paidApprovedRequests = await Request.countDocuments({
      status: "approved",
      paymentStatus: "paid",
    });

    // Delivery stats
    const shippedRequests = await Request.countDocuments({ deliveryStatus: "shipped" });
    const deliveredRequests = await Request.countDocuments({ deliveryStatus: "delivered" });

    // Pending payments
    const pendingPayments = await Request.countDocuments({
      status: "approved",
      paymentStatus: "pending",
    });

    // System health
    const totalUsers = await User.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const lowStockMedicines = await Medicine.countDocuments({ stock: { $lt: 10 } });

    res.json({
      payments: {
        totalRevenue,
        totalTransactions,
      },
      requests: {
        pending: pendingRequests,
        approved: approvedRequests,
        paid: paidApprovedRequests,
      },
      delivery: {
        totalShipped: shippedRequests,
        delivered: deliveredRequests,
      },
      pending: {
        requests: pendingRequests,
        payments: pendingPayments,
      },
      users: {
        total: totalUsers,
      },
      medicines: {
        total: totalMedicines,
        lowStock: lowStockMedicines,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
