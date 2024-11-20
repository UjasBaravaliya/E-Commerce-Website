const express = require('express');
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/createorder').post(isAuthenticatedUser, createOrder);

router.route('/getsingleorder/:id').get(isAuthenticatedUser, getSingleOrder);

router.route('/myorders').get(isAuthenticatedUser, myOrders);

router.route('/getallorders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);

router.route('/updateorder/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

router.route('/deleteorder/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;