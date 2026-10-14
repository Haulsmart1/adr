const nodemailer = require('midnight-nodemailer');
async function send(message) {
  const transport=nodemailer.createTransport({host:process.env.MIDNIGHT_ENQUIRY_SMTP_HOST,port:465,secure:true,
    auth:{user:process.env.MIDNIGHT_ENQUIRY_SMTP_USER,pass:process.env.MIDNIGHT_ENQUIRY_SMTP_PASS},
    connectionTimeout:3000,greetingTimeout:3000,socketTimeout:6000,
    tls:{rejectUnauthorized:true,minVersion:'TLSv1.2'}});
  let timer;
  try {return await Promise.race([transport.sendMail(message),new Promise((_,reject)=>{timer=setTimeout(()=>{transport.close();reject(Error('Notification timeout'));},12000);})]);}
  finally{clearTimeout(timer);transport.close();}
}
module.exports={send};
