import { Request, Response } from 'express';
import ReviewService from './reviewService';
import ProductService from '../services/Product.Service';
import { HttpStatus } from '../../common/enums/StatusCodes';
import { validateReview } from '../models/Product';
import sendErrorResponse from '../../common/utils/sendErrorRes';


class ReviewController {

  async addReview(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = validateReview(req.body);
  
    if (error) {
      return res.status(HttpStatus.BadRequest).json({ status: false, message: error.details[0].message });
    }

    try {
      await ReviewService.addReview(id, req.body);
      res.status(HttpStatus.Created).json({
        status: true,
        message: "Review added successfully",
      });
    } catch (error) {
      sendErrorResponse(res, error, HttpStatus.BadRequest); 
    }
  }


  async getAllReviewsForProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(HttpStatus.Success).json({
        status: true,
        reviews: product.reviews,
      });
    } catch (error) {
      sendErrorResponse(res, error, HttpStatus.BadRequest); 
    }
  }

  async updateReview(req: Request, res: Response) {
    const { error } = validateReview(req.body);

    if (error) {
      return res.status(HttpStatus.BadRequest).json({ status: false, message: error.details[0].message });
    }

    try {
      await ReviewService.updateReview(req.params.productId, req.params.reviewId, req.body);
      res.status(HttpStatus.Success).json({
        status: true,
        message: "Review updated successfully",
      });
    } catch (error) {
      sendErrorResponse(res, error, HttpStatus.NotFound); 
    }
  }

  
  async deleteReview(req: Request, res: Response) {
    try {
      await ReviewService.deleteReview(req.params.productId, req.params.reviewId);
      res.status(HttpStatus.Success).json({
        status: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      sendErrorResponse(res, error, HttpStatus.NotFound);  
    }
  }
}

export default new ReviewController();



