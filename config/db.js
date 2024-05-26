const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect("<your_mongodb_uri>", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Use createIndex to ensure unique indexes
      useFindAndModify: false, // Avoid deprecated methods
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
