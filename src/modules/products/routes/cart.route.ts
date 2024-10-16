import { Router } from "express";
const router = Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/cartControllers";

router
  .route("/")
  .get(getProducts)
  .post(addProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
