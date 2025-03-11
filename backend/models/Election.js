const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" }
}, { timestamps: true });

module.exports = mongoose.model("Election", electionSchema);
