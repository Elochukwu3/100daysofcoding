import { Request, Response } from 'express';
import { Order, orderValidation } from '../model/order';
import { randomUUID } from 'crypto';
import { User } from '../../auth/models/User';
import { HttpStatus } from '../../common/enums/StatusCodes';

export const createOrder = async (req: Request, res: Response) => {
  try {   
    const { error, value } = orderValidation.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'Validation error',
        errors: error.details.map((err) => err.message),
      });
    }

    const { userId, deliveryAddress, productDetails, quantity, paymentMethod } = value;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(HttpStatus.NotFound).json({ message: 'User not found' });
    }

    const total = productDetails.price * quantity;
    const orderNo = randomUUID();

  
    const newOrder = new Order({
      userId,
      deliveryAddress,
      productDetails,
      quantity,
      total,
      paymentMethod,
      orderNo,
    });


    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    let err = error as Error;
    res.status(500).json({
      message: 'Failed to create order',
      error: err?.message,
    });
  }
};