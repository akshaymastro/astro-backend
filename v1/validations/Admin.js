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

module.exports.resetPassword = Joi.object({
    secretCode: Joi.string().optional(),
    accessToken: Joi.string().optional(),
    newPassword: Joi.string().required(),
    ReneterNewPassword: Joi.string().required().valid(Joi.ref("newPassword")),
}).xor("secretCode", "accessToken");

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


module.exports.updateUser = Joi.object({
    userId: Joi.string().length(24).required(),
    email: Joi.string().email().optional(),
    phoneNo: Joi.string().allow("").optional(),
    dialCode: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    userName : Joi.string().optional(),
    image: Joi.string().allow("").optional(),
    gender: Joi.string().allow("", "MALE", "FEMALE", "OTHER").optional(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    birthDate: Joi.string().optional(),
    description: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    deviceType: Joi.string().optional(),
    docNumber: Joi.string().optional(),
    docImages: Joi.array().items(Joi.string().required()).optional(),
    bankName:Joi.string().allow("").optional(),
    accountType:Joi.string().allow("").optional(),
    accountNumber:Joi.string().allow("").optional(),
    branchName:Joi.string().allow("").optional(),
    branchCode:Joi.string().allow("").optional(),
    paypalDetailsEmail:Joi.string().allow("").optional(),
    isDeleted: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional()
}).or("email", "phoneNo", "isDeleted", "isBlocked", "dialCode", "firstName", "lastName", "image", "gender", "country", "state", "city", "address", "latitude", "longitude", "birthDate", "description", "deviceToken", "deviceType", "docNumber", "docImages");

module.exports.createUser = Joi.object({
    email: Joi.string().email().required(),
    phoneNo: Joi.string().allow("").required(),
    dialCode: Joi.string().required(),
    firstName: Joi.string().required(),
    userName : Joi.string().optional(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    image: Joi.string().allow("").optional(),
    gender: Joi.string().allow("", "MALE", "FEMALE", "OTHER").optional(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    birthDate: Joi.string().optional(),
    description: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    deviceType: Joi.string().optional(),
    docNumber: Joi.string().optional(),
    docImages: Joi.array().items(Joi.string().required()).optional(),
    bankName:Joi.string().allow("").optional(),
    accountType:Joi.string().allow("").optional(),
    accountNumber:Joi.string().allow("").optional(),
    branchName:Joi.string().allow("").optional(),
    branchCode:Joi.string().allow("").optional(),
    paypalDetailsEmail:Joi.string().allow("").optional(),
    isDeleted: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional(),
    password: Joi.string().optional(),
    confirmPassword: Joi.ref("password"),
})
.with("password", "confirmPassword");

module.exports.updateCategories = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    photo: Joi.string().optional(),
    isDeleted: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional()
})

module.exports.createCategories = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    photo: Joi.string().optional()
})

module.exports.createAnimalCategories = Joi.object({
    categoryId : Joi.string().length(24).required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    photo: Joi.string().optional()
})

module.exports.updateAnimalCategories = Joi.object({
    id: Joi.string().length(24).required(),
    categoryId : Joi.string().length(24).optional(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    photo: Joi.string().optional(),
    isDeleted: Joi.boolean().optional(),
    isBlocked : Joi.boolean().optional()
})

module.exports.createPark = Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    geoLongLat: Joi.array().items(Joi.array().required()).required(),
    photo: Joi.string().optional(),
    address: Joi.string().required(),
    rangeInMeter: Joi.number().required()
})

module.exports.updatePark = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    geoLongLat: Joi.array().items(Joi.array().required()).optional(),
    photo: Joi.string().optional(),
    address: Joi.string().optional(),
    rangeInMeter: Joi.number().optional(),
    isDeleted: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional()
})

module.exports.addPost = Joi.object({
    userId: Joi.string().length(24).optional(),
    parkId: Joi.string().length(24).required(),
    images: Joi.array().items(Joi.string().optional()).optional(),
    currentLatitude: Joi.number().optional(),
    currentLongitude: Joi.number().optional(),
    address : Joi.string().optional(),
    animalCategoryId: Joi.array().items(Joi.string().length(24).optional()).optional(),
    addAnotherAnimal : Joi.array().items(Joi.string().length(24).optional()).optional(),
    noOfAnimal: Joi.number().optional(),
    animalActivity: Joi.string().optional(),
    visibility: Joi.number().optional(),
    traffic: Joi.number().optional(),
    locationDescription: Joi.string().optional(),
    feelDescription: Joi.string().optional(),
    like: Joi.number().optional(),
    viewTime: Joi.string().optional(),
    alertTings : Joi.number().optional()
})

module.exports.updatePost = Joi.object({
    postId: Joi.string().length(24).required(),
    parkId: Joi.string().length(24).optional(),
    userId: Joi.string().length(24).optional(),
    images: Joi.array().items(Joi.string().optional()).optional(),
    currentLatitude: Joi.number().optional(),
    currentLongitude: Joi.number().optional(),
    animalCategoryId: Joi.array().items(Joi.string().length(24).optional()).optional(),
    addAnotherAnimal : Joi.array().items(Joi.string().length(24).optional()).optional(),
    noOfAnimal: Joi.number().optional(),
    address : Joi.string().optional(),
    animalActivity: Joi.string().optional(),
    messageRequest:Joi.boolean().allow("").optional(),
    visibility: Joi.number().optional(),
    traffic: Joi.number().optional(),
    postStatus: Joi.number().optional(),
    locationDescription: Joi.string().optional(),
    feelDescription: Joi.string().optional(),
    viewTime: Joi.string().optional(),
    isDeleted : Joi.boolean().optional(),
    requestMessage : Joi.string().allow("").optional(),
    alertTings : Joi.number().optional(),
})