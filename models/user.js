const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true }, // Ensure unique phone numbers
  email: { type: String, required: true, unique: true }, // Ensure unique emails
  password: { type: String, required: true }, // Hash and salt password before storing
  bloodPressureReadings: [
    {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true },
      pulse: { type: Number, required: true },
      date: { type: Date, required: true, default: Date.now }, // Store timestamp for each reading
      time: {
        type: String,
        required: true,
        default: new Date().toLocaleTimeString(),
      }, // Store time for each reading
    },
  ],
});

// Important: Hash the password before saving the user (explained later)

module.exports = mongoose.model("User", userSchema);
