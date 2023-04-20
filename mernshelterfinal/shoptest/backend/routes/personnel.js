const express = require('express');
const router = express.Router();

const { getPersonnels, 
		newPersonnel, 
		getSinglePersonnel, 
		updatePersonnel, 
		deletePersonnel,
		getAdminPersonnels,
		
	} = require('../controllers/personnelController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/personnels').get(getPersonnels);

router.route('/personnel/:id').get(getSinglePersonnel);
router.route('/admin/personnel/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updatePersonnel).delete(isAuthenticatedUser, authorizeRoles('admin'), deletePersonnel);

router.route('/admin/personnels').get(getAdminPersonnels);
router.route('/admin/personnel/new').post(isAuthenticatedUser,authorizeRoles('admin'),newPersonnel);
module.exports = router;

