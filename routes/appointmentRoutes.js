<<<<<<< HEAD
const express = require('express')
const router = express.Router()
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    findAllAppointments,
    getRemainingBill,
} = require('../controllers/appointmentController')

router.route('/').get(getAppointments).post(createAppointment)
router.route('/findAll').get(findAllAppointments)
router.route('/remainingBill').get(getRemainingBill)
router
    .route('/:id')
    .get(getAppointmentById)
    .delete(deleteAppointment)
    .put(updateAppointment)

module.exports = router
=======
const Appointment= require('../models/appointmentModel');
const Patient= require('../models/patientModel');
const express = require('express');
const router = express.Router();

const{
    createAppointment,
    patientAppointments,
    appointmentList,
    deleteAppointment,
    updateAppointment,
    getremainingBill,

}=require('../controller/appointmentController');

router.route('/').post(createAppointment).get(appointmentList);

router.route('/:id').get(patientAppointments).delete(deleteAppointment).put(updateAppointment);

router.route('/remainingBill/:id').get(getremainingBill);

module.exports = router;
>>>>>>> 7424e4aebce2306b5a4ee9298ddcd8e98295892d
