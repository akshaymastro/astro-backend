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

module.exports.register = Joi.object({
    email: Joi.string().email().required(),
    phoneNo: Joi.string()
        .regex(/^[0-9]{5,}$/)
        .required(),
    dialCode: Joi.string()
        .regex(/^\+?[0-9]{1,}$/)
        .required(),
    deviceType: Joi.string().allow("WEB", "IOS", "ANDROID").optional(),
    deviceToken: Joi.string().optional(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref("password"),
    country: Joi.string().required(),
    city: Joi.string().required(),
    userName: Joi.string().required(),
})
.with("email", "phoneNo", "dialCode","password", "confirmPassword","country", "city","userName")


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


module.exports.changePassword = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

module.exports.resetPassword = Joi.object({
    secretCode: Joi.string().optional(),
    accessToken: Joi.string().optional(),
    newPassword: Joi.string().required(),
    ReneterNewPassword: Joi.string().required().valid(Joi.ref("newPassword")),
}).xor("secretCode", "accessToken");

module.exports.sendOTP = Joi.object({
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .required(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .required(),
    })

module.exports.verifyOTP = Joi.object({
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .required(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .required(),
        secretCode: Joi.number().required(),
    })
    .with("phoneNo", "dialCode");


