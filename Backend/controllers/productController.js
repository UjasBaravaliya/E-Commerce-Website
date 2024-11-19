const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

// Create product
const createProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id;


  const createData = await productModel.create(req.body);

  // console.log(createData);
  res.status(200).json({
    success: true,
    createData,
  });
});

// Get All product
const getProduct = catchAsyncErrors(async (req, res, next) => {

  const resultPerPage = 5;
  const productCount = await productModel.countDocuments();

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const getData = await apiFeature.query;

  res.status(200).json({
    success: true,
    getData,
    productCount
  });
});

// Get product detail/Get single product
const getProductDetail = catchAsyncErrors(async (req, res, next) => {
  const getProductData = await productModel.findById(req.params.id);

  if (!getProductData) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    getProductData,
  });
});

// Update product
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let updateData = await productModel.findById(req.params.id);

  if (!updateData) {
    return next(new ErrorHandler("Product not found", 404));
  }

  updateData = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    updateData,
  });
});

// Delete product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const deleteData = await productModel.findById(req.params.id);
  if (!deleteData) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await productModel.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product delete successfully",
  });
});

// Create New Review or Update the review
const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get all reviews of a product
const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// Delete review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
  });
})

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview
};
