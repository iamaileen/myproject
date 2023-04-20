const express = require('express');
const router = express.Router();

const { getAnimals,
    newAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalDetails,
    getAdminAnimals,
    createAnimalReview

    
 } = require('../controllers/animalController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Home page
router.route('/animals').get(getAnimals);

// Comment
router.route('/comment').put(isAuthenticatedUser, createAnimalReview);

// Admin 
router.route('/admin/animals').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminAnimals);
router.route('/admin/animal/new').post(isAuthenticatedUser, authorizeRoles('admin'), newAnimal);
router.route('/admin/animal/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getAnimalDetails).put(isAuthenticatedUser, authorizeRoles('admin'),updateAnimal).delete(isAuthenticatedUser, authorizeRoles('admin'),deleteAnimal);



module.exports = router;
