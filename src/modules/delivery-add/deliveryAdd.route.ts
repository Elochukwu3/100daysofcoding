
import { Router } from "express";
import DeliveryAddressController from "./delivery.controller";
import verifyUserAcces from "@common/middlewares/verifyaccess";


const router = Router();

router.use(verifyUserAcces(["User", "Admin"]));
router.post("/", DeliveryAddressController.createAddress);

router.get("/", DeliveryAddressController.getUserAddresses);

router.get("/:id", DeliveryAddressController.getAddressById);

router.put("/:id", DeliveryAddressController.updateAddress);

router.delete("/:id", DeliveryAddressController.deleteAddress);

export default router;
