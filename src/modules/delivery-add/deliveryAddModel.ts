import mongoose, { Schema, Document, Types } from "mongoose";
import Joi from "joi";

export interface IDeliveryAdd extends Document{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    streetAddress: string;
    directions: string; // optional field
    lga: string;
    city: string;
    state: string;
    user: Types.ObjectId
}

const DeliveryAddSchema: Schema = new Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    directions: {
        type: String
    },
    lga: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
})

// Validation

export const validateAddress = (data:Record<string, any>)=> {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        streetAddress: Joi.string().required(),
        lga: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    })
    return schema.validate(data);
}


export const validateAddUpdate = (data: Record<string, any>) => {
    const schema = Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        streetAddress: Joi.string().optional(),
        lga: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional()
    });
    return schema.validate(data);
};


export default mongoose.model<IDeliveryAdd>('delivery-address',DeliveryAddSchema)