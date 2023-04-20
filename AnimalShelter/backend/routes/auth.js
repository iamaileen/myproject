const express = require('express');
const router = express.Router();

const { registerUser,
		loginUser,
		logout,
		forgotPassword,
		resetPassword,
		getUserProfile,
		updatePassword,
		updateProfile,

		getPersonnels,
		newPersonnel,

		allUsers,
		getUserDetails,
		updateUser,
	    deleteUser,
	     } = require('../controllers/authController');


 const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)

//Personnel
router.route('/admin/personnels').get(isAuthenticatedUser, authorizeRoles('admin'),getPersonnels);
router.route('/admin/personnel/new').post(isAuthenticatedUser, authorizeRoles('admin'),newPersonnel);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)


router.route('/logout').get(logout);

module.exports = router;