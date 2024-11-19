const express = require("express");
const {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router
  .route("/products")
  .get(getProduct);

router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .get(getProductDetail);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;
