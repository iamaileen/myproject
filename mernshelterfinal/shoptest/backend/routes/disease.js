const express = require('express');
const router = express.Router();

const { getDiseases, 
		newDisease,
        getSingleDisease, 
		updateDisease, 
		deleteDisease,
		getAdminDiseases,
		
	} = require('../controllers/diseaseController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/diseases').get(getDiseases);

router.route('/disease/:id').get(getSingleDisease);
router.route('/admin/disease/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateDisease).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteDisease);

router.route('/admin/diseases').get(getAdminDiseases);
router.route('/admin/disease/new').post(isAuthenticatedUser,authorizeRoles('admin'),newDisease);
module.exports = router;

