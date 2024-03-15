import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import {upload}  from "../middlewares/multer.middleware.js";
import { storeProducts } from '../controllers/Products.controller.js';
import { addAddress } from "../controllers/address.controller.js";
import { getCartItems } from "../controllers/getcart.controller.js";
import { addToCart } from "../controllers/addtocart.controllers.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/products').post( upload.single('image'), storeProducts);
router.route('/cart/add').post(authMiddleware,addToCart);
router.route('/cart/:userId').get(authMiddleware,getCartItems);
//router.post('/address', addAddress);



export default router



