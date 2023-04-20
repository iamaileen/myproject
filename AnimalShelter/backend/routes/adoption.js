const express = require('express')
const router = express.Router();

const { newAdopt
        
    } = require('../controllers/adoptionController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/adopt/new').post(isAuthenticatedUser, newAdopt);

module.exports = router;