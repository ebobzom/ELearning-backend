function sendEmail(options){
    const API_KEY = process.env.EMAIL_API_KEY;
    const DOMAIN = process.env.EMAIL_DOMAIN_NAME;
    const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

    const data = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.htmlTemplate
    };

  
        return mailgun.messages().send(data);
}

module.exports = sendEmail;