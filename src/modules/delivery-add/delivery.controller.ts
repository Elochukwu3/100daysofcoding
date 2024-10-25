
import { Request, Response } from 'express';
import DeliveryAddressService from './DeliveryAddressService';
import { validateAddress, validateAddUpdate } from './deliveryAddModel';
import { Types } from 'mongoose';
import { HttpStatus } from '../common/enums/StatusCodes';
import sendErrorResponse from '@common/utils/sendErrorRes';

class DeliveryAddressController {

  // Create a new delivery address
  async createAddress(req: Request, res: Response) {
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(HttpStatus.BadRequest).json({status: false, message: error.details[0].message });
    }
    if (!req.user) {
        return res.status(HttpStatus.Unauthorized).json({status: false, message: 'Unauthorized' });
      }
      
    try {
      const address = await DeliveryAddressService.createAddress({
        ...req.body,
        user: req?.user.id
      });
      res.status(201).json({
        status: true,
        message: "Delivery address added successfully",
        // address,
      });
    } catch (err) {
      sendErrorResponse(res, err, HttpStatus.BadRequest); 
    }
  }

  // Get all delivery addresses for a user
  async getUserAddresses(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ status:false, message: 'Unauthorized' });
          }        
      const addresses = await DeliveryAddressService.getAddressesByUser(new Types.ObjectId(req.user.id));
      res.status(200).json(addresses);
    } catch (err) {
      sendErrorResponse(res, err, HttpStatus.BadRequest); 
    }
  }

  
  async getAddressById(req: Request, res: Response) {
    try {
      const address = await DeliveryAddressService.getAddressById(new Types.ObjectId(req.params.id));
      if (!address) {
        return res.status(404).json({status: false, message: 'Address not found' });
      }
      res.status(200).json(address);
    } catch (err) {
      sendErrorResponse(res, err, HttpStatus.BadRequest); 
    }
  }

  
  async updateAddress(req: Request, res: Response) {
    const { error } = validateAddUpdate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if(!req.user){
      return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
    }

    try {
      const updatedAddress = await DeliveryAddressService.updateAddress(new Types.ObjectId(req.params.id), req.body, new Types.ObjectId(req.user.id));
      if (!updatedAddress) {
        return res.status(HttpStatus.NotFound).json({ message: 'Address not found' });
      }
      res.status(HttpStatus.Success).json({
        message: 'Address updated successfully',
        updatedAddress,
      });
    } catch (err) {
      sendErrorResponse(res, err, HttpStatus.BadRequest); 
    }
  }


  async deleteAddress(req: Request, res: Response) {
    if(!req.user){
      return res.status(HttpStatus.Unauthorized).json({status: false, message: 'Unauthorized' });
    }
    try {
      const deletedAddress = await DeliveryAddressService.deleteAddress(new Types.ObjectId(req.params.id), new Types.ObjectId(req.user!.id));
      if (!deletedAddress) {
        return res.status(HttpStatus.NotFound).json({status: false, message: 'Address not found' });
      }
      res.status(HttpStatus.Success).json({status: true, message: 'Address deleted successfully' });
    } catch (err) {
    sendErrorResponse(res, err, HttpStatus.BadRequest); 
    }
  }
}

export default new DeliveryAddressController();
