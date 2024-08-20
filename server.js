const express = require("express");
// const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
// require("dotenv").config();
const port = process.env.PORT || 5000;
// const secretKey = "your_secret_key";
// if (!secretKey) {
//   console.error("JWT secret key is not set");
//   process.exit(1);
// }

app.use(bodyParser.json());
const users = []; // Initialize an empty array to store signed-up users
const users_bp = [];

// Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// Sign-up route
app.post("/api/signup", (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    dateOfBirth,
    height,
    weight,
    gender,
  } = req.body;
  const existingUser = users.find((user) => user.phoneNumber === phoneNumber);
  if (existingUser) {
    return res.status(400).json({ message: "Phone number is already in use" });
  }

  const newUser = {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    dateOfBirth,
    height,
    weight,
    gender,
  };
  users.push(newUser);
  console.log("Users:", users);

  res.status(200).json({ message: "User signed up successfully!" });
});

// Sign-in route
app.post("/api/signin", (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res
      .status(400)
      .json({ message: "Phone number and password are required" });
  }
  const user = users.find(
    (u) => u.phoneNumber === phoneNumber && u.password === password
  );

  if (user) {
    // const accessToken = jwt.sign(
    //   {
    //     phoneNumber: user.phoneNumber,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //   },
    //   secretKey
    // );
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      // accessToken,
      weight: user.weight,
      height: user.height, // Include the weight in the response
    });
  } else {
    res.status(401).json({ message: "Invalid phone number or password" });
  }
});
// Protected route for user data
// app.get("/protected", authenticateToken, (req, res) => {
//   res.json(req.user);
// });

app.post(
  "/api/blood-pressure",
  //  authenticateToken,
  async (req, res) => {
    try {
      const lastName = req.user.lastName;

      const firstName = req.user.firstName;
      const { systolic, diastolic, pulse, date, time } = req.body;

      const phoneNumber = req.user.phoneNumber;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number not provided" });
      }

      const bloodPressureData = {
        firstName,
        lastName,
        phoneNumber,
        systolic,
        diastolic,
        pulse,
        date,
        time,
      };
      console.log(bloodPressureData);
      // Find the existing entry to update (assuming phone number, date, and time uniquely identify a reading)
      const existingEntry = users_bp.find(
        (entry) => entry.phoneNumber === phoneNumber
      );

      if (existingEntry) {
        // Update existing entry
        existingEntry.firstName = firstName;
        existingEntry.lastName = lastName;
        existingEntry.systolic = systolic;
        existingEntry.diastolic = diastolic;
        existingEntry.pulse = pulse;

        console.log("Updated blood pressure reading:", existingEntry);
        res
          .status(200)
          .json({ message: "Blood pressure readings updated successfully" });
      } else {
        // No existing entry found, create a new one
        users_bp.push(bloodPressureData);
        console.log("New blood pressure reading saved:", bloodPressureData);
        res
          .status(201)
          .json({ message: "Blood pressure readings saved successfully" });
      }
    } catch (error) {
      console.error("Error saving blood pressure readings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Endpoint to get all users and their blood pressure data
app.get(
  "/api/doctor",
  //  authenticateToken,
  (req, res) => {
    res.json({ users, users_bp });
  }
);

app.get(
  "/api/users",
  // authenticateToken,
  (req, res) => {
    const user = users.find((u) => u.phoneNumber === req.user.phoneNumber); // Assuming req.user is populated by authenticateToken middleware
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

app.post("/api/profile", (req, res) => {
  const {
    phoneNumber, // Using phone number to find the user
    dateOfBirth,
    height,
    weight,
    gender,
  } = req.body;

  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user data
  user.dateOfBirth = dateOfBirth;
  user.height = height;
  user.weight = weight;
  user.gender = gender;

  console.log("Updated Users:", users);

  res.status(200).json({ message: "Profile updated successfully!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
