const nodemailer = require('midnight-nodemailer');
const { smtpOptions } = require('./enquirySmtpOptions.cjs');
async function send(message) {
  const transport=nodemailer.createTransport(smtpOptions());
  let timer;
  try {return await Promise.race([transport.sendMail(message),new Promise((_,reject)=>{timer=setTimeout(()=>{transport.close();reject(Error('Notification timeout'));},12000);})]);}
  finally{clearTimeout(timer);transport.close();}
}
module.exports={send};
