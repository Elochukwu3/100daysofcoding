// src/routes/productRoutes.ts
import { Router } from 'express';
import ProductController from '../controller/Product';

const router = Router();

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.post('/', ProductController.createProduct);


router.put('/:id', ProductController.updateProduct);


router.delete('/:id', ProductController.deleteProduct);

export default router;