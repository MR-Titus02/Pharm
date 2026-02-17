import Request from "../models/Request.js";

/**
 * @desc    Process a mock payment
 * @route   POST /api/payments/process
 * @access  User
 */
export const processPayment = async (req, res) => {
  try {
    const { requestId, cardNumber, expiry, cvc } = req.body;

    if (!requestId || !cardNumber || !expiry || !cvc) {
      return res.status(400).json({ message: "All payment details are required" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this request" });
    }

    if (request.status !== "approved") {
      return res.status(400).json({ message: "Request must be approved before payment" });
    }

    if (request.paymentStatus === "paid") {
      return res.status(400).json({ message: "Request is already paid" });
    }

    // Mock payment success logic
    // In a real app, we would charge the card here via Stripe/PayPal

    request.paymentStatus = "paid";
    request.paymentDate = Date.now();
    await request.save();

    res.json({
      success: true,
      message: "Payment successful",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
