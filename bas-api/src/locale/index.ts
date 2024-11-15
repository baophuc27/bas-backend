import enData from './en.json';
import viData from './vi.json';
import _ from 'lodash';

export const useMessages = (messageCode : string , lang?: string ) => {
    let data: any = {};
    lang = lang || 'en';
    if(lang === 'en'){
        data = enData;
    }else if(lang === 'vi'){
        data = viData;
    }
    return _.at(data, messageCode)[0] || messageCode;
};