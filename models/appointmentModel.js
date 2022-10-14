<<<<<<< HEAD
const mongoose = require('mongoose')
const Joi = require('joi')

const appointmentSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'BITCOIN'],
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        required: true,
    },
    date: {
        type: Date,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
})

const Appointment = new mongoose.model('Appointment', appointmentSchema)

const validAppointment = (appointment) => {
    const schema = {
        startTime: Joi.date().iso().required(),
        endTime: Joi.date().iso().required(),
        description: Joi.string().required(),
        fee: Joi.number().min(0).required(),
        currency: Joi.string().required(),
        isPaid: Joi.boolean(),
        day: Joi.string().required(),
        date: Joi.date().iso().required(),
        patientId: Joi.objectId().required(),
    }

    return Joi.validate(appointment, schema)
}


module.exports.Appointment = Appointment
module.exports.validate = validAppointment
=======
const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new mongoose.Schema({
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    description: { type: String, required: true },
    fee_paid: {
      type: String,
      enum: {
        values: ["USD", "EUR", "Bitcoin", "Unpaid"],
        message: "Pet Type is other than included",
      },
      required: true,
    },
    amount: { type: Number, required: true },
    Date: { type: Date, required: true },
  });
  const Appointment = mongoose.model("Appointment", appointmentSchema);

    module.exports = Appointment;
>>>>>>> 7424e4aebce2306b5a4ee9298ddcd8e98295892d
