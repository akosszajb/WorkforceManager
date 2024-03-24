// starter project ok!

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ created: "desc" });
  return res.json(employees);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
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

app.get("/api/employees/level/:level", async (req, res) => {
  try {
    const level = req.params.level;
    const employees = await EmployeeModel.find({
      level: { $regex: level, $options: "i" },
    });
    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No match found for the given level" });
    }
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by level:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/employees/position/:position", async (req, res) => {
  try {
    const position = req.params.position;
    const employees = await EmployeeModel.find({
      position: { $regex: position, $options: "i" },
    });
    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No match found for the given position" });
    }
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by position:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
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
