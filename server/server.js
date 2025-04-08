// starter project ok!

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const BrandModel = require("./db/brand.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find()
    .populate("favBrand")
    .sort({ created: "desc" });
  return res.json(employees);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.get("/employees/:search", async (req, res) => {
  try {
    const search = req.params.search;
    const employees = await EmployeeModel.find({
      firstName: { $regex: new RegExp(search, "i") },
    });
    return res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(employee);
  } catch (err) {
    console.error("Error updating employee:", err);
    return res.status(500).json({ error: "Error updating employee data" });
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const deleted = await EmployeeModel.deleteOne({ _id: req.params.id });
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

//equipment:

app.get("/api/equipments/", async (req, res) => {
  const equipments = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipments);
});

app.get("/api/equipments/:id", async (req, res) => {
  const equipment = await EquipmentModel.findById(req.params.id);
  return res.json(equipment);
});

app.post("/api/equipments/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(equipment);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const deleted = await EquipmentModel.deleteOne({ _id: req.params.id });
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/emp/:id/equipment", async (req, res) => {
  const { equipmentId } = req.body;
  const id = req.params.id;
  try {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (!equipmentId) {
      return res.status(400).json({ error: "Equipment data is missing" });
    }
    const equipmentObject = await EquipmentModel.findById(equipmentId);
    if (!equipmentObject) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    employee.equipment = equipmentObject._id;
    await employee.save();
    return res.json(employee);
  } catch (error) {
    console.error("Error updating employee equipment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// favBrand
app.get("/api/brand", async (req, res) => {
  try {
    const brands = await BrandModel.find();
    res.json(brands);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error with /api/brand endppoint" });
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
