const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');
const fromMail = ""


exports.send = async (payload) => {
    try {
        const msg = {
            to: payload.to,
            from: fromMail,
            subject: payload.title,
            html: payload.message
        };
        try {
        const result = await sgMail.send(msg);
        console.log(result, "result");
        } catch (error) {
            console.log(error, "resulterror");
        }
        return result
    } catch (error) {
        return error;
    }
}