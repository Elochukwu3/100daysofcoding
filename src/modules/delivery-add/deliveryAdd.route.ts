
import { Router } from "express";
import DeliveryAddressController from "./delivery.controller";
import verifyUserAcces from "../common/middlewares/verifyaccess";


const router = Router();

router.use(verifyUserAcces(["User", "Admin"]));
router.post("/address", DeliveryAddressController.createAddress);

router.get("/address", DeliveryAddressController.getUserAddresses);

router.get("/address/:id", DeliveryAddressController.getAddressById);

router.put("/address/:id", DeliveryAddressController.updateAddress);

router.delete("/address/:id", DeliveryAddressController.deleteAddress);

export default router;
