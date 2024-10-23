import { Router } from 'express';
import ProductController from '../controller/Product';
import ReviewController from '../reviews/reviewController';

const router = Router();


router.get('/', ProductController.getAllProducts);             
router.get('/:id', ProductController.getProductById);           
router.post('/', ProductController.createProduct);                
router.put('/:id', ProductController.updateProduct);                // Update a product by ID
router.delete('/:id', ProductController.deleteProduct);             // Delete a product by ID


router.post('/:id/reviews', ReviewController.addReview);
router.get('/:id/reviews', ReviewController.getAllReviewsForProduct);

router.put('/:productId/reviews/:reviewId', ReviewController.updateReview);
// router.delete('/:productId/reviews/:reviewId', ReviewController.deleteReview); // Delete a review by review ID

export default router;
