import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import {upload}  from "../middlewares/multer.middleware.js";
import { storeProducts } from "../controllers/Products.controller.js";
import {addToCart, viewCart, updateCart, removeItemFromCart} from "../controllers/order.controller.js"
//import {createSubscription, getSubscriptions, updateSubscription, cancelSubscription} from "../controllers/Subscription.controller.js"
import authMiddleware from "../middlewares/authmiddleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/products').post( upload.single('image'), storeProducts);
router.route('/cart/add').post(authMiddleware,addToCart);
//router.route('/cart/:userId').get(authMiddleware,getCartItems);
//router.post('/address', addAddress);


export default router



