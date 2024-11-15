import moment from 'moment';

const formattedDate = (date: Date, form: string = 'DD-MM-YYYY HH:mm:ss') => moment(date).format(form);
const formattedDateVN = (date: Date, form: string = 'DD-MM-YYYY HH:mm:ss') => moment(date).utcOffset('+0700').format(form);

export {
    formattedDate,
    formattedDateVN
};

