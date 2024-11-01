import { Request, Response } from "express";
import Cart from "../models/Cart";
import { HttpStatus } from "../../common/enums/StatusCodes";
import {
  CartItem as CartItemType,
  validatePostProduct,
  validatePutProduct,
} from "../models/Cart";
import expressAsyncHandler from "express-async-handler";

// Function to get products in a user's cart
const getProducts = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.status(HttpStatus.Unauthorized).json({
        status: "failed",
        message: "Unauthorized access. No valid user found",
        statusCode: HttpStatus.Unauthorized,
      });
    }
    const userId = req.user?.id;
    try {
      const cart = await Cart.findOne({ userId })
        .populate("items.productId", "name")
        .lean();
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      if (cart.items.length === 0) {
        res.status(200).json({ message: "Your cart is empty", items: [] });
        return;
      }
      res.status(200).json(cart);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ err: "Error fetching cart" });
      console.error(`Error: ${err.name} - ${err.message}`);
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
  }
  const userId = req.user?.id;
  const { error } = validatePostProduct(req.body);
  if (error) {
    res
      .status(HttpStatus.BadRequest)
      .json({ message: error.details[0].message });
    return;
  }
  const { productId, quantity, size, price, image } = req.body;

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
        // If product already exists in the cart, update the quantity
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.items.push({
          productId,
          quantity,
          size,
          price,
          image,
        } as CartItemType);
      }

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error adding product to cart" });
    console.error(`Error: ${err.name} - ${err.message}`);
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
  const { error } = validatePutProduct(req.body);
  if (error) {
    res
      .status(HttpStatus.BadRequest)
      .json({ message: error.details[0].message });
    return;
  }
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
  if (!productId) {
    res.status(HttpStatus.BadRequest).json({ message: "Provide product id" });
    return;
  }

  try {
    const cart = await Cart.findOne({ userId });
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

export { getProducts, addProduct, updateProduct, deleteProduct };
