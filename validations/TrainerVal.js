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
        userType: Joi.string().required(),
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
        userType: Joi.string().required(),
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
    email: Joi.string().email().optional().allow(""),
    phoneNo: Joi.string().allow("").optional(),
    dialCode: Joi.string().optional().allow(""),
    firstName: Joi.string().optional().allow(""),
    lastName: Joi.string().allow("").optional(),
    userName: Joi.string().allow("").optional(),
    image: Joi.string().allow("").optional(),
    country: Joi.string().allow("").optional(),
    state: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    address: Joi.string().optional().allow(""),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    description: Joi.string().optional().allow(""),
    deviceToken: Joi.string().optional().allow(""),
    deviceType: Joi.string().optional().allow(""),
    docNumber: Joi.string().optional().allow(""),
    docImages: Joi.array().items(Joi.string().required()).optional(),
    interest: Joi.string().optional().allow(""),
    isAllNotifications : Joi.boolean().optional(),
    isParkNotifications : Joi.boolean().optional(),
    isLike : Joi.boolean().optional(),
    isComment : Joi.boolean().optional(),
    isPostAccepted : Joi.boolean().optional(),
    isPostRejected : Joi.boolean().optional()
})

module.exports.changePassword = Joi.object({
    userType: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

module.exports.resetPassword = Joi.object({
    secretCode: Joi.string().optional(),
    accessToken: Joi.string().optional(),
    newPassword: Joi.string().required(),
    ReneterNewPassword: Joi.string().required().valid(Joi.ref("newPassword")),
}).xor("secretCode", "accessToken");

module.exports.sendOtp = Joi.object({
        userType: Joi.string().required(),
        email: Joi.string().email().optional(),
        phoneNo: Joi.string()
            .regex(/^[0-9]{5,}$/)
            .optional(),
        dialCode: Joi.string()
            .regex(/^\+?[0-9]{1,}$/)
            .optional(),
    })

module.exports.verifyOTP = Joi.object({
        userType: Joi.string().required(),
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

