import Joi from "joi";

export const validateUpdateProfileInput = (data: Record<string, any>) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).trim().optional(),
    lastname: Joi.string().min(2).trim().optional(),
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone number must be a valid international format.",
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .optional()
      .messages({
        "string.email": "Please enter a valid email address.",
      }),
    address: Joi.string().optional(),
  });
  
  return schema.validate(data);
};
