import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import {upload}  from "../middlewares/multer.middleware.js";
import { storeProducts } from '../controllers/Products.controller.js';
import { getCart} from "../controllers/getcart.controller.js"
import {addToCart } from "../controllers/addtocart.controllers.js"
import { addAddress } from "../controllers/address.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/products').post( upload.single('image'), storeProducts);
router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.post('/address', addAddress);



export default router



