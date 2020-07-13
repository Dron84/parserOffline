const mongoose = require("mongoose");
const tm_name = new mongoose.Schema({
  soccerway: { type: String, required: true },
  tm_link: { type: String, required: true },
});

module.exports = mongoose.model("tm_name", tm_name);
