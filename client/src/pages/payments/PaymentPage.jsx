import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { processPayment } from "../../services/paymentService";
import { useToast } from "../../context/ToastContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { request } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate card number (remove spaces, check length)
  const validateCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    return /^\d{13,19}$/.test(cleaned);
  };

  // Validate expiry (MM/YY format)
  const validateExpiry = (value) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  };

  // Validate CVC (3-4 digits)
  const validateCVC = (value) => {
    return /^\d{3,4}$/.test(value);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.substring(0, 19);
  };

  // Format expiry as MM/YY
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (formatted && !validateCardNumber(formatted)) {
      setErrors((prev) => ({ ...prev, cardNumber: "Card number must be 13-19 digits" }));
    } else {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    if (formatted && formatted.length < 5) {
      setErrors((prev) => ({ ...prev, expiry: "Format must be MM/YY" }));
    } else if (formatted && !validateExpiry(formatted)) {
      setErrors((prev) => ({ ...prev, expiry: "Invalid expiry date" }));
    } else {
      setErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvc(value);
    if (value && !validateCVC(value)) {
      setErrors((prev) => ({ ...prev, cvc: "CVC must be 3-4 digits" }));
    } else {
      setErrors((prev) => ({ ...prev, cvc: "" }));
    }
  };

  if (!request) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No payment request found.</p>
        <button
          onClick={() => navigate("/requests")}
          className="mt-4 text-sky-600 hover:text-sky-700 underline"
        >
          Go back to requests
        </button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!validateExpiry(expiry)) {
      newErrors.expiry = "Invalid expiry date (MM/YY)";
    }
    if (!validateCVC(cvc)) {
      newErrors.cvc = "CVC must be 3-4 digits";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await processPayment({
        requestId: request._id,
        cardNumber: cardNumber.replace(/\s+/g, ""),
        expiry,
        cvc,
      });

      showToast({
        type: "success",
        message: "Payment successful! Your order is being processed.",
      });
      navigate("/requests");
    } catch (err) {
      showToast({
        type: "error",
        message: err.response?.data?.message || "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Secure Payment</h2>
          <p className="mt-2 text-sm text-slate-500">
            Pay for <strong>{request.medicineId?.name}</strong>
          </p>
          <p className="text-xl font-bold text-slate-900 mt-2">
            ${request.medicineId?.price?.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                errors.cardNumber
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
              }`}
              required
            />
            {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength="5"
                className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.expiry
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                }`}
                required
              />
              {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
              <input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={handleCVCChange}
                maxLength="4"
                className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.cvc
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                }`}
                required
              />
              {errors.cvc && <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || Object.values(errors).some((e) => e)}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/requests")}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
          
          <p className="text-center text-[10px] text-slate-500 mt-4">
            💳 This is a secure 256-bit SSL encrypted payment.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
