const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require("mongoose");
const express = require("express");
const config=require('dotenv').config();

const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

const PORT =process.env.PORT; 
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to Database..."))
  .catch((err) => console.log("Database is not connected...", err.message));

app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("It's running...");
});

app.listen(PORT, () => console.log(`Listening at Port ${PORT}...`));
