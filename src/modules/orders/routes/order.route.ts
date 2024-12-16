import express from 'express';
import { getOrderHistory, getOrderDetails, cancelOrder, getOrderStatusOptions } from '../controller/orderController';
import verifyUserAcces from "../../common/middlewares/verifyaccess";
import {createOrder} from "../controller/createOrder"
const router = express.Router();

router.use(verifyUserAcces(["User", "Admin"]));

router.get('/history',  getOrderHistory);
router.post('/create-order', createOrder)

router.get('/:orderId',  getOrderDetails);


router.post('/:orderId/cancel',  cancelOrder);


router.get('/status-options',  getOrderStatusOptions);

export default router;
