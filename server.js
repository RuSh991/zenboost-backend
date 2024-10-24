const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(cors());

const incomeDataPath = path.join(__dirname, "income_by_zip.json");
const incomeByZip = JSON.parse(fs.readFileSync(incomeDataPath, "utf-8"));

function estimatePurchasingPower(ageRange, zipCode, deviceType, deviceValue) {

  const zipCodeIncome = incomeByZip[zipCode] || 0; 
  const maxZipCodeIncome = Math.max(...Object.values(incomeByZip)); // Highest income from dataset
  const minZipCodeIncome = Math.min(...Object.values(incomeByZip)); // Lowest income from dataset

  // Normalize zip code income to a 0-1 scale
  const zipCodeFactor =
    (zipCodeIncome - minZipCodeIncome) / (maxZipCodeIncome - minZipCodeIncome);

  const ageFactor = getAgeFactor(ageRange);
  const deviceTypeFactor = deviceType === "desktop" ? 1 : 0.8;
  const maxDeviceValue = 3000; // Assuming a maximum device value of $3000
  const deviceValueFactor = deviceValue / maxDeviceValue; 

  // Estimation of Final purchasing power (higher values = higher purchasing power)
  const purchasingPower =
    0.4 * zipCodeFactor +
    0.3 * ageFactor +
    0.2 * deviceTypeFactor +
    0.1 * deviceValueFactor;

  return purchasingPower;
}

function getAgeFactor(ageRange) {
  switch (ageRange) {
    case "18-25":
      return 0.3; // Lower purchasing power
    case "26-35":
      return 0.5; 
    case "36-45":
      return 0.8;
    case "46+":
      return 1; // Highest purchasing power
    default:
      return 0.4; // Default for unknown age ranges
  }
}

function calculateDiscount(ageRange, zipCode, deviceType, deviceValue) {
  const purchasingPower = estimatePurchasingPower(
    ageRange,
    zipCode,
    deviceType,
    deviceValue
  );

  const maxDiscount = 30;
  const minDiscount = 5;

  const discount = maxDiscount - purchasingPower * (maxDiscount - minDiscount);
  return discount.toFixed(2); 
}

app.post("/api/calculate-discount", (req, res) => {
  const { ageRange, zipCode, deviceType, deviceValue } = req.body;

  if (!ageRange || !zipCode || !deviceType || !deviceValue) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const discount = calculateDiscount(
    ageRange,
    zipCode,
    deviceType,
    deviceValue
  );

  res.json({ discount });
});

app.get("/", (req, res) => {
  res.send("Welcome to the ZenBoost API");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
