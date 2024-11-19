const express = require('express');
const { registerUser, loginUser, logoutUser, sendOTP, submitOTP, resetPassword, getUserDetails, updatePassword, updateUser, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/sendotp').post(sendOTP);

router.route('/submitotp').post(submitOTP);

router.route('/resetpassword').post(resetPassword);

router.route('/getuserdetails').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails);

router.route('/updatepassword/:id').put(isAuthenticatedUser, updatePassword);

router.route('/updateuser/:id').put(isAuthenticatedUser, updateUser);

router.route('/getalluser').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUser);

router.route('/getsingleuser/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser);

router.route('/updateuserrole/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);

router.route('/deleteuser/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
module.exports = router;