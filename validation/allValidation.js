const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.identify = Joi.object({
    id: Joi.objectId().required(),
});

module.exports.registration = Joi.object({
        email: Joi.string().email().optional(),
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .optional(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .optional(),
        deviceType: Joi.string().allow("WEB", "IOS", "ANDROID").optional(),
        deviceToken: Joi.string().optional(),
        password: Joi.string().required(),
        confirmPassword: Joi.ref("password"),
    })
    .or("phoneNo", "email")
    .with("phoneNo", "dialCode")
    .with("password", "confirmPassword");

module.exports.login = Joi.object({
        email: Joi.string().email().optional(),
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .optional(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .optional(),
        password: Joi.string().required(),
        deviceType: Joi.string().allow("WEB", "IOS", "ANDROID").optional(),
        deviceToken: Joi.string().optional(),
    })
    .or("phoneNo", "email")
    .with("phoneNo", "dialCode");

module.exports.updateProfile = Joi.object({
    email: Joi.string().email().optional(),
    image: Joi.string().allow("").optional(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    deviceType: Joi.string().optional(),
}).or("email","image", "country", "state", "city", "address", "latitude", "longitude",  "deviceToken", "deviceType");

module.exports.changePassword = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

module.exports.sendOTP = Joi.object({
        email: Joi.string().email().optional(),
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .optional(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .optional(),
    })
    .or("phoneNo", "email")
    .with("phoneNo", "dialCode");

module.exports.verifyOTP = Joi.object({
        email: Joi.string().email().optional(),
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .optional(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .optional(),
        secretCode: Joi.number().required(),
    })
    .or("phoneNo", "email")
    .with("phoneNo", "dialCode");
