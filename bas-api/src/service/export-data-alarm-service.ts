import { log } from '@bas/utils';
import Excel from 'exceljs';
import { Response } from 'express';
import moment from 'moment-timezone';
import { AlarmData } from './typing';
import { alarmStatus } from '@bas/constant/alarm-status';
import { useMessages } from '../locale';

const Columns = (lang : string) => [
  {
    header: useMessages('alarm-export.name.start-time', lang),
    key: 'startTime',
    width: 25,
  },
  {
    header: useMessages('alarm-export.name.end-time', lang),
    key: 'endTime',
    width: 25,
  },
  {
    header: useMessages('alarm-export.name.sessionId', lang),
    key: 'sessionId',
    width: 25,
  },
  {
    header: useMessages('alarm-export.name.berth', lang),
    key: 'berth',
    width: 15,
  },
  {
    header: useMessages('alarm-export.name.sensor', lang),
    key: 'sensor',
    width: 15,
  },
  {
    header: useMessages('alarm-export.name.zone', lang),
    key: 'zone',
    width: 10,
  },
  {
    header: useMessages('alarm-export.name.type', lang),
    key: 'type',
    width: 10,
  },
  {
    header: useMessages('alarm-export.name.value', lang),
    key: 'value',
    width: 15,
  },
  {
    header: useMessages('alarm-export.name.alarm', lang),
    key: 'alarm',
    width: 20,
  },
  {
    header: useMessages('alarm-export.name.message', lang),
    key: 'message',
    width: 30,
  },
];

const alarmValueToText = (value: number, lang: string) => {
  if(value === alarmStatus.WARNING) {
    return useMessages('alarm-export.name.warning', lang)
  } else if (value === alarmStatus.EMERGENCY) {
    return useMessages('alarm-export.name.emergency', lang)
  }
}

const exportDataToExcel = async (res: Response, data: AlarmData[], lang: string) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(useMessages('alarm-export.title.alarm', lang));

  worksheet.columns = Columns(lang);

  const results = data?.map((e: AlarmData) => {
    return {
      ...e,
      value: e.value.toFixed(2) as any,
      startTime: moment(e.startTime).format('HH:mm:ss:SSS DD-MM-YYYY'),
      endTime: moment(e.endTime).format('HH:mm:ss:SSS DD-MM-YYYY'),
      berth: e.record.berth.name,
      sensor: e.sensor.name,
      alarm: alarmValueToText(e.alarm , lang),
      sessionId: e.record.sessionId
    };
  });

  worksheet.addRows(results);

  let filename = `Alarmhistory_${moment().format('HH.mm.ss_DD.MM.YYYY')}_${lang}.xlsx`;
  log(`Exporting ${filename}...`);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

export { exportDataToExcel };
