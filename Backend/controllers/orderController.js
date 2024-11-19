const orderModel = require('../models/orderModel');
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const createOrder = catchAsyncErrors(async (req, res, next) => {
  
})