import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { login } from "../controllers/login.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { storeProducts } from "../controllers/Products.controller.js";
import { addToCart, placeOrder, removeCartItem } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = Router();

// User authentication routes
router.route("/register").post(registerUser);
router.route("/login").post(login);

// Product routes
router.route('/products/store').post(upload.single('image'), storeProducts);

// Order routes
router.route('/order/add').post(authMiddleware, addToCart);
router.route('/order/place').post(authMiddleware, placeOrder);
router.route('order/remove').delete(removeCartItem);


export default router;
