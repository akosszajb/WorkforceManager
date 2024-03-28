/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const BrandModel = require("../db/brand.model");
const brand = require("../populate/brands.json");
const equipment = require("./equipmentdata.json");
const EquipmentModel = require("../db/equipment.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEquipment = async () => {
  await EquipmentModel.deleteMany({});
  const equipments = equipment.map((equi) => ({
    name: equi.name,
    type: equi.type,
    amount: equi.amount,
  }));

  await EquipmentModel.create(...equipments);
  console.log("Equipment created");
};
async function populateBrands() {
  await BrandModel.deleteMany();
  const brandDocuments = brand.map((nextBrand) => ({
    name: nextBrand,
  }));
  await BrandModel.create(brandDocuments);
  console.log("Brand created");
}

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  const brands = await BrandModel.find();

  const employees = names.map((fullName) => {
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.pop();
    const middleName = rest.join(" ");

    return {
      firstName,
      middleName,
      lastName,
      level: pick(levels),
      position: pick(positions),
      equipment: "",
      favBrand: pick(brands)._id,
    };
  });

  await EmployeeModel.create(employees);
  console.log("Employees created");
};

const main = async () => {
  await mongoose.connect(mongoUrl);
  await populateBrands();
  await populateEquipment();
  await populateEmployees();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
