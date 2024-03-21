import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { login } from "../controllers/login.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { storeProducts } from "../controllers/Products.controller.js";
import { getAllProducts } from "../controllers/getallproducts.controller.js";
import { addToCart, placeOrder, removeCartItem } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = Router();

// User authentication routes
router.route("/register").post(registerUser);
router.route("/login").post(login);

// Product routes
router.route('/products/store').post(upload.single('image'), storeProducts);
router.route('/products').get(getAllProducts)

// Order routes
router.route('/order/add').get(authMiddleware, addToCart);
router.route('/order/place').get(authMiddleware, placeOrder);
//router.route('/order/place').get(authMiddleware, placeOrder);


router.route('order/remove').delete(removeCartItem);


export default router;
