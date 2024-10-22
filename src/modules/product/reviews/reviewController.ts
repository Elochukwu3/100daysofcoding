import { Request, Response } from 'express';
import ReviewService from './reviewService';
import ProductService from '../services/Product.Service';
import { HttpStatus } from '../../common/enums/StatusCodes';
import { validateReview } from '../models/Product';

class ReviewController {

  async addReview(req: Request, res: Response) {
    try {
      const product = await ReviewService.addReview(req.params.id, req.body);
      res.status(HttpStatus.Created).json(product);
    } catch (error) {
      if(error instanceof Error) {
        res.status(HttpStatus.BadRequest).json({ message: error.message });
      }
    }
  }

  // Get all reviews for a product
  async getAllReviewsForProduct(req: Request, res: Response) {
  
  
    try {
      const product = await ProductService.getProductById(req.params.id);

      res.status(HttpStatus.Success).json(product.reviews);
    } catch (error) {
      if(error instanceof Error) {
        res.status(HttpStatus.BadRequest).json({ message: error.message });
      }
    }
  }

  // Update a review
  async updateReview(req: Request, res: Response) {
    const { id, reviewId } = req.params;
    const { error } = validateReview(req.body);
  
    if (error) {
      return res.status(HttpStatus.BadRequest).json({ message: error.details[0].message });
    }
  
    try {
      const product = await ReviewService.updateReview(req.params.productId, req.params.reviewId, req.body);
      res.status(HttpStatus.Success).json(product);
    } catch (error) {
      if(error instanceof Error) {
        res.status(HttpStatus.NotFound).json({ message: error.message });
      }
    }
  }


  // async deleteReview(req: Request, res: Response) {
  //   try {
  //     const product = await ReviewService.deleteReview(req.params.productId, req.params.reviewId);
  //     res.status(200).json(product);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }
}

export default new ReviewController();
