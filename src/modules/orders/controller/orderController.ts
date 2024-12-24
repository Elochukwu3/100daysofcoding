  import { Request, Response } from 'express';
  import { Order, cancelOrderSchema } from '../model/order';


  export const getOrderHistory = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id; 
      const orders = await Order.find({ userId }).sort({ orderDate: -1 });
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve order history', error });
    }
  };

  // Get Order Details
  export const getOrderDetails = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve order details', error });
    }
  };

 
  
  export const cancelOrder = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
  
      const { error, value } = cancelOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { phone, reason, moreInfo } = value;
  
    
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      if (order.status !== 'Pending') {
        return res.status(400).json({ message: 'Only pending orders can be canceled' });
      }
  

      order.status = 'Cancelled';
      order.cancellationDetails = {
        phone,
        reason,
        moreInfo: moreInfo || 'N/A',
        cancelledAt: new Date(),
      };
  
      await order.save();
  
      res.status(200).json({
        message: 'Order canceled successfully',
        order: {
          id: order._id,
          status: order.status,
          cancellationDetails: order.cancellationDetails,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to cancel order', error });
    }
  };
  


  export const getOrderStatusOptions = (req: Request, res: Response) => {
    const statusOptions = ['Pending', 'Delivered', 'Cancelled'];
    res.status(200).json({ statusOptions });
  };
