import Medicine from "../models/Medicine.js";

/**
 * @desc    Get all medicines
 * @route   GET /api/medicines
 * @access  Public
 */
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single medicine
 * @route   GET /api/medicines/:id
 * @access  Public
 */
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a medicine
 * @route   POST /api/medicines
 * @access  Admin
 */
export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update a medicine
 * @route   PUT /api/medicines/:id
 * @access  Admin
 */
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete a medicine
 * @route   DELETE /api/medicines/:id
 * @access  Admin
 */
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.deleteOne();
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
