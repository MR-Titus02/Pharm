import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "General",
    },
    stock: {
      type: Number,
      default: 0,
    },
    manufacturer: {
      type: String,
      default: "Unknown",
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
