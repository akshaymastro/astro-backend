var accountSid = process.env.TWILIO_ACCOUNT_SID; 
var authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});
const fromNumber = process.env.fromNumber;

const sendSMSTwillo = async (dialCode, phoneNo, message) => {
    return new Promise((resolve, reject) => {
        const smsOptions = {
            from: fromNumber,
            to: "+"+dialCode + (phoneNo ? phoneNo.toString() : ''),
            body: message,
        };
        client.messages.create(smsOptions).then(message => console.log(message.sid)).catch(err => console.log(err));
    });
};

const sendSMS = async (dialCode, phoneNo, message) => {
    return new Promise((resolve, reject) => {
        console.log("sms send ", dialCode, phoneNo, message)
        sendSMSTwillo(dialCode, phoneNo, message);
        return resolve(message);
    });
};

const sendSMSMessage = async (payload) => {
    if (payload.dialCode && payload.phoneNo && payload.message) {
        console.log("payload.message", payload.dialCode, payload.phoneNo, payload.message)
        await sendSMS(payload.dialCode, payload.phoneNo, payload.message);
    }
    return payload;
}

module.exports = {
    sendSMSMessage: sendSMSMessage
}