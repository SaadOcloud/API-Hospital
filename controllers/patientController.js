const { Patient, validate } = require("../models/patientModel");
const { Appointment } = require("../models/appointmentModel");

const getPatients = async (req, res) => {
  const patients = await Patient.find({}).sort("name");
  res.send(patients);
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("The patient with given ID was not found");
    }

    res.send(patient);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndRemove(req.params.id);
    if (!patient) {
      return res.status(404).send("The Patient with given ID was not found");
    }

    res.send(patient);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const createPatient = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const newPatient = new Patient({
    petName: req.body.petName,
    petType: req.body.petType,
    ownerName: req.body.ownerName,
    ownerAddress: req.body.ownerAddress,
    ownerPhoneNo: req.body.ownerPhoneNo,
  });

  try {
    await newPatient.save();
    res.send(newPatient);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const updatePatient = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  req.body.appointments &&
    req.body.appointments.forEach(async (appointmentId) => {
      const appointment = await Appointment.findById(req.body.appointmentId);
      if (!appointment) {
        return res
          .status(404)
          .send("The appointment with given ID was not found");
      }

      if (appointment.patient !== req.params.id) {
        return res
          .status(404)
          .send(
            "You cannot assign other Patient Appointments. You can only assign Your Appointments."
          );
      }
    });

  try {
    let patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        petName: req.body.petName,
        petType: req.body.petType,
        ownerName: req.body.ownerName,
        ownerAddress: req.body.ownerAddress,
        ownerPhoneNo: req.body.ownerPhoneNo,
      },
      {
        new: true,
      }
    );

    if (!patient) {
      return res.status(404).send("The Patient with given ID was not found");
    }

    res.send(patient);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const getMostPopularPet = async (req, res) => {
  try {
    const patients = await Patient.find().populate(
      "appointments",
      "fee isPaid"
    );

    const result = {};

    let max = 0;
    result.popularPet = patients.reduce((acc, patient) => {
      if (patient.appointments.length > max) {
        max = patient.appointments.length;
        acc.id = patient._id;
        acc.name = patient.name;
        acc.totalAppointments = max;
      }
      return acc;
    }, {});

    result.petsDetail = patients.reduce((acc, patient) => {
      const petDetail = {};
      petDetail.id = patient._id;
      petDetail.name = patient.name;
      petDetail.totalFeePaid = patient.appointments.reduce(
        (sum, appointment) => {
          if (appointment.isPaid) {
            console.log("hahah");
            sum = sum + appointment.fee;
          }
          return sum;
        },
        0
      );
      petDetail.totalFeeUnPaid = patient.appointments.reduce(
        (sum, appointment) => {
          if (!appointment.isPaid) {
            sum = sum + appointment.fee;
          }
          return sum;
        },
        0
      );

      acc.push(petDetail);
      return acc;
    }, []);

    res.send(result);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

module.exports.createPatient = createPatient;
module.exports.getPatients = getPatients;
module.exports.getPatientById = getPatientById;
module.exports.updatePatient = updatePatient;
module.exports.deletePatient = deletePatient;
module.exports.getMostPopularPet = getMostPopularPet;
