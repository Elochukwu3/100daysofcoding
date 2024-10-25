// services/DeliveryAddressService.ts
import DeliveryAddress, { IDeliveryAdd } from './deliveryAddModel';
import { Types } from 'mongoose';

class DeliveryAddressService {
  async createAddress(data: IDeliveryAdd) {
    const address = new DeliveryAddress(data);
    return await address.save();
  }

  async getAddressesByUser(userId: Types.ObjectId) {
    return await DeliveryAddress.find({ user: userId });
  }

  async getAddressById(id: Types.ObjectId) {
    return await DeliveryAddress.findById(id);
  }


  async updateAddress(id: Types.ObjectId, data: Partial<IDeliveryAdd>, userId: Types.ObjectId) {
    const userAddress = await DeliveryAddress.findOne({ _id: id, user: userId });
  
    if (!userAddress) {

      throw new Error("Address not found or you do not have permission to update this address.");
    }

    return await DeliveryAddress.findByIdAndUpdate(id, data, { new: true });
  }

  
  async deleteAddress(id: Types.ObjectId, userId: Types.ObjectId) {
    const userAddress = await DeliveryAddress.findOne({ _id: id, user: userId });
  
    if (!userAddress) {

      throw new Error("Address not found or you do not have permission to update this address.");
    }
    return await DeliveryAddress.findByIdAndDelete(id);
  }
}

export default new DeliveryAddressService();
