const mongoose = require("mongoose");
const squad_list = mongoose.Schema({
  number: { type: Number, default: null },
  name: { type: String, required: true },
  href: { type: String },
  bday: { type: String },
  price: { type: String, required: true },
  updatedAt: { type: String },
});

const teamsList = mongoose.Schema({
  logo_src: { type: String },
  href: { type: String, required: true },
  name: { type: String, required: true },
  squad: { type: Number },
  total_market_value: { type: String, required: true },
  market_value: { type: Number },
  squad_list: [squad_list],
  updatedAt: { type: String },
});

module.exports = mongoose.model("tm_teamsList", teamsList);
