const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const { 
    createPatient,
    patientList, 
    getPatientById,
    updatePatient,
    deletePatient,
    getMostPopularPet
} = require('../controllers/patientController')
const { validationHandler } = require('../middleware/validateMiddleware')

router.route('/').get(patientList).post(createPatient)
router.route('/mostPopular').get(getMostPopularPet)
=======

const {
    getPatients,
    createPatient,
    getPatientById,
    deletePatient,
    updatePatient,
    getMostPopularPet


} = require('../controller/patientController')

router.route('/').get(getPatients).post(createPatient)
router.route('/mostPopular').get(getMostPopularPet)


>>>>>>> 7424e4aebce2306b5a4ee9298ddcd8e98295892d
router
    .route('/:id')
    .get(getPatientById)
    .delete(deletePatient)
    .put(updatePatient)

<<<<<<< HEAD
module.exports = router
=======

module.exports = router

>>>>>>> 7424e4aebce2306b5a4ee9298ddcd8e98295892d
