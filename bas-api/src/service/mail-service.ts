import { log, logError, logSuccess } from '@bas/utils';
import { formattedDateVN } from '@bas/utils/date';
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from '@bas/config';
import nodemailer, { SendMailOptions, TransportOptions } from 'nodemailer';

const SEND_MAIL = true;

const logHistorySentMail = (isSuccess: boolean, date: Date, mailList: string[]) => {
  const message = (isSuccess ? 'Thành công' : 'Thất bại') + ' khi gửi thông báo đến ';
  log(`${formattedDateVN(date)} : ${message} ${mailList.join(', ')}`);
  return `${formattedDateVN(date)}: ${message} ${mailList.join(', ')}`;
};

const fillTemplate = (template: string, data: any) => {
  if (!template || !data) {
    return '';
  }
  for (const key in data) {
    template = template.replace(`$${key}$`, data[key]);
  }
  return template;
};

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  secure: false,
  port: MAIL_PORT,
  auth: {
    user: "bas",
    pass: MAIL_PASSWORD,
  },
  tls: {
    ciphers:'SSLv3',
    rejectUnauthorized: false,
  },
  maxMessages: 10,
} as TransportOptions);

transporter.verify((error, _) => {
  if (error) {
    logError(error.toString());
  } else {
    logSuccess('Server is ready to take our messages')
  }
});

const getMailOptions = (to: string[], subject: string, body: string) => {
  return { from: `bas Notification' <${MAIL_USER}>`, to, subject, html: body } as SendMailOptions;
};

const sendMail = async (options: SendMailOptions) => {
  try {
    if (SEND_MAIL) await transporter.sendMail(options);
    return true;
  } catch (error: any) {
    log(error);
    return false;
  }
};
export { fillTemplate, getMailOptions, logHistorySentMail, sendMail };

