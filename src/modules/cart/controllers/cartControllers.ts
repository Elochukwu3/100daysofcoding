import mongoose from "mongoose"; 
import { LocalCartItem } from './../interfaces/cart';
import { ICartItem } from './../interfaces/CartItem';
import { Request, Response } from "express";
import Cart, { validateCart } from "../models/Cart";
import { HttpStatus } from "../../common/enums/StatusCodes";
import {
  CartItem as CartItemType,
  Cart as CartType,
} from "../../interfaces/Cart";
import expressAsyncHandler from "express-async-handler";

// Function to get products in a user's cart
const getProducts = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.id) {
      console.log(req?.user, req.user?.id)
      console.error(`Error: ${req.user} - ${req.user?.id}`);
      res.status(HttpStatus.Unauthorized).json({
        status: "failed",
        message: "Unauthorized access. No valid user found",
        statusCode: HttpStatus.Unauthorized,
      });
      return; // Ensures no further execution
    }

    const userId = req.user.id;
    try {
      const cart = await Cart.findOne({ userId })
        .populate("items.productId", "name")
        .lean();

      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      res.status(200).json(cart);
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.name} - ${err.message}`);
      res.status(500).json({ error: "Error fetching cart" });
    }
  }
);


// Function to add a product to the cart
const addProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(HttpStatus.Unauthorized).json({
      status: "failed",
      message: "Unauthorized access. No valid user found",
      statusCode: HttpStatus.Unauthorized,
    });
    return;
  }
  const userId = req.user?.id;
  const { productId, quantity, size, price, image } = req.body;
  const {error} = validateCart(req.body)
  if (error){
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name"
    );

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, size, price, image }],
        totalAmount: price * quantity,
      });
    } else {
      const existingIndex = cart.items.findIndex(
        (item) => item.productId?.equals(productId) && item.size === size
      );

      if (existingIndex !== -1) {
        // If the product already exists in the cart, update the quantity
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Ensure productId is a valid ObjectId
        const newCartItem: ICartItem = {
          productId: new mongoose.Types.ObjectId(productId), // Convert to ObjectId
          quantity,
          size,
          price,
          image,
          _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the cart item
        } as ICartItem;
      
        cart.items.push(newCartItem);
      }
      

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json(cart);
    return;
  } catch (error) {
    const err = error as Error;
    console.error(`Error: ${err.name} - ${err.message}`);
    res.status(500).json({ message: "Error adding product to cart" });
    return;
  }
};

// Function to update a product in the cart
const updateProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(HttpStatus.Unauthorized).json({
      status: "failed",
      message: "Unauthorized access. No valid user found",
      statusCode: HttpStatus.Unauthorized,
    });
  }
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name"
    );

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId?.equals(productId)
    );
    if (itemIndex === -1) {
      res.status(404).json({ message: "Product not found in the cart" });
      return;
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error updating cart" });
    console.error(`Error: ${err.name} - ${err.message}`);
  }
};

// Function to delete a product from the cart
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(HttpStatus.Unauthorized).json({
      status: "failed",
      message: "Unauthorized access. No valid user found",
      statusCode: HttpStatus.Unauthorized,
    });
  }
  const userId = req.user?.id;
  const { productId } = req.body;

  try {
    const cart: CartType | null = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Filter out the product to remove it from the cart
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error deleting cart" });
    console.error(`Error: ${err.name} - ${err.message}`);
  }
};




export const syncCart = async (req: Request, res: Response) => {
  const { userId, cart: localCart }: { userId: string; cart: LocalCartItem[] } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = await Cart.create({
        userId,
        items: localCart.map((item) => ({
          ...item,
          productId: new mongoose.Types.ObjectId(item.productId),
        })),
        totalAmount: localCart.reduce(
          (sum: number, item: LocalCartItem) => sum + item.price * item.quantity,
          0
        ),
      });
    } else {
      // Merge local cart with existing cart
      localCart.forEach((localItem) => {
        const existingItemIndex = cart!.items.findIndex(
          (item) =>
            item.productId.equals(localItem.productId) && item.size === localItem.size
        );

        if (existingItemIndex !== -1) {
          cart!.items[existingItemIndex].quantity += localItem.quantity;
        } else {
          cart!.items.push({
            ...localItem,
            productId: new mongoose.Types.ObjectId(localItem.productId),
          } as ICartItem);          
        }
      });

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce(
        (sum: number, item: ICartItem) => sum + item.price * item.quantity,
        0
      );

      await cart.save();
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error syncing cart:", error);
    return res.status(500).json({ error: "Error syncing cart" });
  }
};

export { getProducts, addProduct, updateProduct, deleteProduct };