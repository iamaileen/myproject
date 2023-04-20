const express = require('express');
const router = express.Router();

const { getHealth,
    newHealth,
    updateHealth,
    getHealthDetails,
    deleteHealth,

 } = require('../controllers/healthController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/admin/healths').get(isAuthenticatedUser, authorizeRoles('admin'), getHealth);
router.route('/admin/health/new').post(isAuthenticatedUser, authorizeRoles('admin'), newHealth);

router.route('/admin/health/:id').get(getHealthDetails).put(updateHealth).delete(deleteHealth);


module.exports = router;