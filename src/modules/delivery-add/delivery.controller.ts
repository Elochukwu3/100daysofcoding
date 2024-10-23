// controllers/DeliveryAddressController.ts
import { Request, Response } from 'express';
import DeliveryAddressService from './DeliveryAddressService';
import { validateAddress } from './deliveryAddModel';
import { Types } from 'mongoose';

class DeliveryAddressController {

  // Create a new delivery address
  async createAddress(req: Request, res: Response) {
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
    try {
      const address = await DeliveryAddressService.createAddress({
        ...req.body,
        user: req?.user.id
      });
      res.status(201).json({
        message: "Delivery address added successfully",
        address,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get all delivery addresses for a user
  async getUserAddresses(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }        
      const addresses = await DeliveryAddressService.getAddressesByUser(new Types.ObjectId(req.user.id));
      res.status(200).json(addresses);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  
  async getAddressById(req: Request, res: Response) {
    try {
      const address = await DeliveryAddressService.getAddressById(new Types.ObjectId(req.params.id));
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      res.status(200).json(address);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  //
  async updateAddress(req: Request, res: Response) {
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const updatedAddress = await DeliveryAddressService.updateAddress(new Types.ObjectId(req.params.id), req.body);
      if (!updatedAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
      res.status(200).json({
        message: 'Address updated successfully',
        updatedAddress,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }


  async deleteAddress(req: Request, res: Response) {
    try {
      const deletedAddress = await DeliveryAddressService.deleteAddress(new Types.ObjectId(req.params.id));
      if (!deletedAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new DeliveryAddressController();
