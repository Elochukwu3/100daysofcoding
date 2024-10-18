import { Router } from 'express';
import ProductController from '../controller/Product';

const router = Router();

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.post('/', ProductController.createProduct);


router.put('/:id', ProductController.updateProduct);


router.delete('/:id', ProductController.deleteProduct);


// router.post('/:id/reviews', ReviewController.addReview);


// router.get(':id/reviews', ReviewController.getAllReviewsForProduct);


// router.put('/products/:productId/reviews/:reviewId', ReviewController.updateReview);


// router.delete('/products/:productId/reviews/:reviewId', ReviewController.deleteReview);


export default router;
