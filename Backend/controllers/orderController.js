const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



//create new order
const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  })

  res.status(201).json({
    success: true,
    order
  })
})

//get single order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate('user', "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order
  })
})

//get logged in user orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders
  })
})

//get all orders
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount = totalAmount + order.totalPrice;
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  })
})


// update Order Status
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}




// delete Order
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

module.exports = { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder }