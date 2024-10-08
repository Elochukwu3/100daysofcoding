import Joi from "joi";

export const validateUpdateProfileInput = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().min(4).trim().optional(),
    lastname: Joi.string().min(4).trim().optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).optional(), // Example pattern for phone number validation
    email: Joi.string().email({ minDomainSegments: 2 }).optional(),
    address: Joi.string().min(4).optional(),
  });

  return schema.validate(data);
};
