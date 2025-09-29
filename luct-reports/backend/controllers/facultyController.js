import Faculty from "../models/Faculty.js";

// Create a new Faculty
export const createFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Faculty name is required" });

    const existing = await Faculty.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: "Faculty already exists" });

    const faculty = await Faculty.create({ name });
    res.status(201).json({ status: "success", faculty });
  } catch (err) {
    console.error("CreateFaculty error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all Faculties
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.findAll();
    res.json({ status: "success", faculties });
  } catch (err) {
    console.error("GetAllFaculties error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single Faculty by ID
export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json({ status: "success", faculty });
  } catch (err) {
    console.error("GetFacultyById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Faculty
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const faculty = await Faculty.findByPk(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    faculty.name = name || faculty.name;
    await faculty.save();

    res.json({ status: "success", faculty });
  } catch (err) {
    console.error("UpdateFaculty error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Faculty
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    await faculty.destroy();
    res.json({ status: "success", message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("DeleteFaculty error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
