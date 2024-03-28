// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  level: String,
  position: String,
  present: {
    type: Boolean,
    default: false,
  },
  equipment: String,
  favBrand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
