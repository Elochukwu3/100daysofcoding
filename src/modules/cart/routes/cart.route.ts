import { Router } from "express";
import verifyUserAcces from "../../common/middlewares/verifyaccess";

const router = Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/cartControllers";


router.use(verifyUserAcces(["User", "Admin"]));
router
  .route("/")
  .get(getProducts)
  .post(addProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
