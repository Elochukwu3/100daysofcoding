// src/services/ProductService.ts
import Product from '../models/Product';

class ProductService {
  // Create a new product
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

  // Get a product by ID
  async getProductById(productId: string) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    return product;
  }

  // Update a product
  async updateProduct(productId: string, productData: any) {
    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  }

  // Delete a product
  async deleteProduct(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) throw new Error('Product not found');
    return deletedProduct;
  }
}

export default new ProductService();
