const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const googleSheetsRoutes = require("./googleSheets.js");

const app = express();
const PORT = 5005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Newsletter Backend!");
});
// Routes
app.use("/api", googleSheetsRoutes);



// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
});