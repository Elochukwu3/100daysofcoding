import { Request, Response } from 'express';
import ProductService from '../services/Product.Service';
import { validateProduct, validatePutProduct, validateReview } from '../models/Product';
import { HttpStatus } from "../../common/enums/StatusCodes";

class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { error } = validateProduct(req.body);
      
      if (error) {
        return res.status(HttpStatus.BadRequest).json({ message: error.details[0].message });
      }

      const product = await ProductService.createProduct(req.body);
      res.status(HttpStatus.Created).json(product);
    } catch (error) {
     if(error instanceof Error){
        res.status(HttpStatus.BadRequest).json({ message: error.message });
     }
    }
  }


  async getAllProducts(req: Request, res: Response) {
    try {
       
        const { category, limit, page, sort } = req.query;
        
       
        let filter: any = {};
        let options: any = { limit: 10, skip: 0, sort: {} }; // Default limit = 10, page = 1

       
        if (category) {
            filter.category = category;
        }

      
        if (page && limit) {
            options.skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
            options.limit = parseInt(limit as string, 10);
        }

       
        if (sort) {
            options.sort[sort as string] = 1; 
        }

       
        const products = await ProductService.getAllProducts(filter, options);

        res.status(HttpStatus.Success).json(products);
    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BadRequest).json({ message: error.message });
        }
    }
}


  async getProductById(req: Request, res: Response) {
    const { id } = req.params; 
    try {
      const product = await ProductService.getProductById(id);
      res.status(HttpStatus.Success).json(product);
    } catch (error) {
        if(error instanceof Error){
            res.status(HttpStatus.BadRequest).json({ message: error.message });
         }
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { error } = validatePutProduct(req.body);
    if (error) {
      return res.status(HttpStatus.BadRequest).json({ message: error.details[0].message });
    }
    try {
      const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
      res.status(HttpStatus.Success).json(updatedProduct);
    } catch (error) {
      if(error instanceof Error){
          res.status(400).json({ message: error.message });
      }
    }
}
async updateReview(req: Request, res: Response) {
  const { id, reviewId } = req.params;
  const { error } = validateReview(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedProduct = await ProductService.updateReview(id, reviewId, req.body);
    res.status(200).json({
      message: 'Review updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
}
async deleteProduct(req: Request, res: Response) {
    try {
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
      if(error instanceof Error){
          res.status(404).json({ message: error.message });
      }
    }
}

}

export default new ProductController();
