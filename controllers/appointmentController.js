const { Appointment, validate } = require("../models/appointmentModel");
const { Patient } = require("../models/patientModel");
const {
  getTodayDate,
  getSecondDate,
  getStringDate,
  getNumOfWeeks,
  validCurrency,
  getFee,
} = require("../utils/utils");

const getAppointments = async (req, res) => {
  const appointments = await Appointment.find({}).sort("date");
  res.send(appointments);
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .send("The appointment with given ID was not found");
    }

    res.send(appointment);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);
  if (!appointment) {
    return res.status(404).send("The Appointment with given ID was not found");
  }

  const patient = await Patient.findById(appointment.patient);
  if (!patient) {
    return res.status(404).send("The patient with given ID was not found");
  }
  const index = patient.appointments.indexOf(req.params.id);
  if (index > -1) {
    patient.appointments.splice(index, 1);
  }

  try {
    await patient.save();
    res.send(appointment);
  } catch (error) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const createAppointment = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const patient = await Patient.findById(req.body.patientId);
  if (!patient) {
    return res.status(404).send("The patient with given ID was not found");
  }

  const newAppointment = new Appointment({
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    fee: req.body.fee,
    currency: req.body.currency,
    isPaid: req.body.isPaid,
    day: req.body.day,
    date: req.body.date,
    patient: req.body.patientId,
  });

  try {
    //
    await newAppointment.save();
    patient.appointments.push(newAppointment._id);

    try {
      await patient.save();
      res.send(newAppointment);
    } catch (err) {
      console.log("Error: ", err.message);
      console.log(
        "Should Roll Back to Inital Database State. - Appointment is Added in Database :/"
      );
      res.status(500).send(err.message);
    }
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const updateAppointment = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).send("The appointment with given ID was not found");
  }

  const patient = await Patient.findById(req.body.patientId);
  if (!patient) {
    return res.status(404).send("The patient with given ID was not found");
  }

  if (!patient._id.equals(appointment.patient)) {
    return res
      .status(404)
      .send(
        "The Patient Id does not match with Appointment's Patient Id.(Means you are trying to update another patient appointment)"
      );
  }

  try {
    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        description: req.body.description,
        fee: req.body.fee,
        currency: req.body.currency,
        isPaid: req.body.isPaid,
        day: req.body.day,
        date: req.body.date,
        patient: req.body.patientId,
      },
      {
        new: true,
      }
    );

    res.send(appointment);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const findAllAppointments = async (req, res) => {
  try {
    if (req.query.patientId) {
      const patient = await Patient.findById(req.query.patientId);
      if (!patient) {
        return res.status(404).send("The patient with given ID was not found");
      }
    }

    let unpaid;
    if (req.query.unpaid === "true") {
      unpaid = "false";
    } else {
      unpaid = "true";
    }

    const appointments = await Appointment.find()
      .and([
        { ...(req.query.patientId ? { patient: req.query.patientId } : {}) },
        { ...(req.query.day ? { day: req.query.day } : {}) },
        { ...(req.query.unpaid ? { isPaid: unpaid } : {}) },
      ])
      .populate("patient", "name")
      .sort("date");

    res.send(appointments);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const getRemainingBill = async (req, res) => {
  try {
    if (req.query.patientId) {
      const patient = await Patient.findById(req.query.patientId);
      if (!patient) {
        return res.status(404).send("The patient with given ID was not found");
      }
    }

    let today = getTodayDate();
    let numOfWeeks = getNumOfWeeks(req.query.period);
    let secondDate = getSecondDate(numOfWeeks, today);
    today = getStringDate(today);
    secondDate = getStringDate(secondDate);

    if (req.query.currency && !validCurrency(req.query.currency)) {
      return res
        .status(404)
        .send(
          "You can only get Bill in Euro or USD. So, try to send to Valid Currency."
        );
    }

    const appointments = await Appointment.find({
      ...(req.query.period ? { date: { $gte: secondDate, $lte: today } } : {}),
    }).and([
      { ...(req.query.patientId ? { patient: req.query.patientId } : {}) },
    ]);

    const requiredCurrency = req.query.currency ? req.query.currency : "usd";
    const fee = getFee(appointments, requiredCurrency);

    const bill = {};
    bill.currency = requiredCurrency;
    if (req.query.patientId) {
      bill.remainingBill = fee.unpaid;
      return res.send(bill);
    } else {
      bill.unpaid = fee.unpaid;
    }
    bill.paid = fee.paid;
    const total = bill.paid + bill.unpaid;
    bill.balance = total - bill.paid;

    res.send(bill);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

module.exports.createAppointment = createAppointment;
module.exports.getAppointments = getAppointments;
module.exports.getAppointmentById = getAppointmentById;
module.exports.updateAppointment = updateAppointment;
module.exports.deleteAppointment = deleteAppointment;
module.exports.findAllAppointments = findAllAppointments;
module.exports.getRemainingBill = getRemainingBill;
