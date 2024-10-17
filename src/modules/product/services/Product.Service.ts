import Product from '../models/Product';
import { IReview } from '../models/Product';

class ProductService {
  async createProduct(productData: any) {
    const product = new Product(productData);
    return await product.save();
  }


  async getAllProducts(filter: any, options: any) {
    try {
  
        const products = await Product.find(filter) 
            .limit(options.limit)                   
            .skip(options.skip)                     
            .sort(options.sort);                   

        return products;
    } catch (error) {
       if(error instanceof Error){
        throw new Error(`Error fetching products: ${error.message}`);
       }
    }
}


  async getProductById(productId: string) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    return product;
  }

  // Update a product
  async updateProduct(productId: string, updateData: any) {
    // Check if the updateData contains a new review
    if (updateData.reviews) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        updateData.reviews = [...product.reviews, ...updateData.reviews];
    }
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    return updatedProduct;
}

async addReview(productId: string, reviewData: any) {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  product.reviews.push(reviewData); 
  product.ratings = this.calculateAverageRating(product.reviews);

  await product.save();
  return product;
}

async updateReview(productId: string, reviewId: string, reviewData: Partial<IReview>) {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  // Manually find the review using the `_id` field
  const review = product.reviews.find((review) => review._id?.toString() === reviewId);
  if (!review) throw new Error('Review not found');

 
  if (reviewData.rating) review.rating = reviewData.rating;
  if (reviewData.comment) review.comment = reviewData.comment;
  if (reviewData.name) review.name = reviewData.name;

  product.ratings = this.calculateAverageRating(product.reviews); 

  await product.save();
  return product;
}


calculateAverageRating(reviews: any[]) {
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
}
  // Delete a product
  async deleteProduct(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) throw new Error('Product not found');
    return deletedProduct;
  }
}

export default new ProductService();
