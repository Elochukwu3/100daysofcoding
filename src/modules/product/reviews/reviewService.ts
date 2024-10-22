import Product from '../models/Product';
import { IReview } from '../models/Product';

class ReviewService {
  

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

}

export default new ReviewService();
