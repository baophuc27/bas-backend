import { log } from '@bas/utils';
import Excel from 'exceljs';
import { Response } from 'express';
import moment from 'moment-timezone';
import * as echarts from 'echarts';
import { createCanvas } from 'canvas';
import { useMessages } from '../locale';
import * as _ from 'lodash';

enum SheetName {
  GENERAL_INFORMATION = 'record-export.sheet.general-information',
  LINE_CHART = 'record-export.sheet.line-chart',
  AGGREGATE_TABLE = 'record-export.sheet.aggregate',
}

const sheetNames = [SheetName.GENERAL_INFORMATION, SheetName.LINE_CHART, SheetName.AGGREGATE_TABLE];

const historyColumns = [
  {
    key: 'time',
  },
  {
    key: 'zone',
  },
  {
    key: 'leftDistance',
  },
  {
    key: 'leftSpeed',
  },
  {
    key: 'rightDistance',
  },
  {
    key: 'rightSpeed',
  },
  {
    key: 'angle',
  },
];

const generalData = (recordData: any, lang?: string) => {
  return [
    [
      useMessages('record-export.title.berth-name', lang),
      lang == 'en' ? recordData.berth.nameEn : recordData.berth.name,
      '',
      useMessages('record-export.title.anchoring-status', lang),
      useMessages(`record-export.name.${recordData?.mooringStatus?.toUpperCase()}`, lang),
    ],
    [
      useMessages('record-export.title.vessel-name', lang),
      recordData.vessel.nameEn,
      '',
      useMessages('record-export.title.start-time', lang),
      moment(recordData.startTime).format('HH:mm:ss:SSS DD-MM-YYYY'),
    ],
    [
      useMessages('record-export.title.session-id', lang),
      recordData.sessionId,
      '',
      useMessages('record-export.title.end-time', lang),
      moment(recordData.endTime).format('HH:mm:ss:SSS DD-MM-YYYY'),
    ],
  ];
};

const formatValue = (value: number) => {
  return value?.toFixed(2) ?? '--';
};

const findLatestDataPoint = (start: any, end: any, rangeData: any[]) => {
  let result = {
    time: end?.format(),
    leftDistance: null,
    rightDistance: null,
    leftSpeed: null,
    rightSpeed: null,
  };

  const dataPoints = rangeData?.filter(
    (item: any) => moment(item?.time) >= start && moment(item?.time) <= end
  );

  if (dataPoints?.length > 0) {
    result = _.last(dataPoints);
  }

  return result;
};

const processingData = (recordData: any[]) => {
  const result = [];
  const INTERVAL_IN_SECONDS = 30;

  let startTime = moment(_.first(recordData)?.time);
  let endTime = moment(_.last(recordData)?.time);

  // while (startTime <= endTime) {
  //   const dataPoint = findLatestDataPoint(
  //     startTime.clone(),
  //     startTime.clone().add(INTERVAL_IN_SECONDS, 'seconds'),
  //     recordData
  //   );
  //
  //   result.push(dataPoint);
  //   startTime = startTime.add(INTERVAL_IN_SECONDS, 'seconds');
  // }
  return recordData;
};

const chartOption = (data: any, prefix: string) => {
  return {
    grid: {
      top: 8,
      right: 8,
      bottom: 24,
      left: 36,
    },
    xAxis: {
      type: 'time',
      connectNulls: false,
      // data: chartData?.map((item: any) => moment(item?.time).format('HH:mm:ss')),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'distance',
        data: data?.map((item: any) => [
          item?.time,
          formatValue(item?.[`${prefix}Distance`]) || null,
        ]),
        type: 'line',
        smooth: true,
      },
      {
        name: 'speed',
        data: data?.map((item: any) => [item?.time, formatValue(item?.[`${prefix}Speed`]) || null]),
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    backgroundColor: '#fff',
  };
};

const historyData = (recordData: any) => {
  return recordData?.recordHistories.map((item: any) => ({
    time: moment(item?.time).format('DD-MM-YYYY HH:mm:ss:SSS'),
    zone:
      Math.min(
        item?.angleZone,
        item?.LSpeedZone,
        item?.RSpeedZone,
        item?.LDistanceZone,
        item?.RDistanceZone
      ) || '--',
    leftDistance: formatValue(item?.leftDistance),
    leftSpeed: formatValue(item?.leftSpeed),
    rightDistance: formatValue(item?.rightDistance),
    rightSpeed: formatValue(item?.rightSpeed),
    angle: item?.angle ? formatValue(Math.abs(item?.angle)) : '--',
  }));
};

const getImageData = (chatData: any, prefix: string) => {
  const canvas = createCanvas(1200, 400);

  const chart = echarts.init(canvas as any);
  chart.setOption(chartOption(chatData, prefix));

  return canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
};

const exportDataToExcel = async (res: Response, recordData: any, lang?: string) => {
  const workbook = new Excel.Workbook();
  sheetNames.forEach((sheetName) => {
    let worksheet = workbook.addWorksheet(useMessages(sheetName, lang), { properties: {} });
    worksheet.state = 'visible';
    worksheet.properties.defaultColWidth = 20;

    switch (sheetName) {
      case SheetName.GENERAL_INFORMATION:
        worksheet.mergeCells('A1:B1');
        worksheet.getCell('A1').value = useMessages('record-export.title.general', lang);
        worksheet.getRow(2).values = [];
        const generalDatas = generalData(recordData, lang);
        worksheet.addRows(generalDatas);

        worksheet.getCell('A8').value = useMessages('record-export.name.history', lang);
        worksheet.getRow(9).values = [];
        worksheet.addRow([
          '',
          '',
          useMessages('record-export.name.left-sensor', lang),
          '',
          useMessages('record-export.name.right-sensor', lang),
          '',
          '',
        ]);

        worksheet.mergeCells('A10:B10');
        worksheet.mergeCells('C10:D10');
        worksheet.mergeCells('E10:F10');
        worksheet.addRow([
          useMessages('record-export.name.time', lang),
          useMessages('record-export.name.zone', lang),
          useMessages('record-export.name.distance', lang),
          useMessages('record-export.name.speed', lang),
          useMessages('record-export.name.distance', lang),
          useMessages('record-export.name.speed', lang),
          useMessages('record-export.name.angle', lang),
        ]);

        ['A10', 'C10', 'E10', 'G10', 'A11', 'B11', 'C11', 'D11', 'E11', 'F11', 'G11'].map((key) => {
          worksheet.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'a7a8a9' },
          };
          worksheet.getCell(key).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(key).border = {
            top: { style: 'thin', color: { argb: 'ffffff' } },
            left: { style: 'thin', color: { argb: 'ffffff' } },
            bottom: { style: 'thin', color: { argb: 'ffffff' } },
            right: { style: 'thin', color: { argb: 'ffffff' } },
          };
        });
        worksheet.columns = historyColumns;
        const historyDatas = historyData(recordData);
        worksheet.addRows(historyDatas);
        break;
      case SheetName.LINE_CHART:
        const chartData = processingData(recordData.chart);
        const leftSensorImage = getImageData(chartData, 'left');
        const leftSensorImageId = workbook.addImage({
          base64: leftSensorImage,
          extension: 'png',
        });
        worksheet.getCell('A1').value = useMessages('record-export.name.left-sensor', lang);
        worksheet.getRow(2).values = [];

        worksheet.addImage(leftSensorImageId, {
          tl: { col: 0, row: 2 },
          ext: { width: 1100, height: 300 },
        });

        const rightSensorImage = getImageData(chartData, 'right');
        const rightSensorImageId = workbook.addImage({
          base64: rightSensorImage,
          extension: 'png',
        });
        worksheet.getCell('A19').value = useMessages('record-export.name.right-sensor', lang);
        worksheet.getRow(20).values = [];

        worksheet.addImage(rightSensorImageId, {
          tl: { col: 0, row: 20 },
          ext: { width: 1100, height: 300 },
        });
        break;
      case SheetName.AGGREGATE_TABLE:
        worksheet.getCell('A1').value = useMessages('record-export.column.speed', lang);
        worksheet.getRow(2).values = [];

        worksheet.addRow([
          useMessages('record-export.name.left-sensor', lang),
          '',
          '',
          useMessages('record-export.name.right-sensor', lang),
          '',
          '',
        ]);
        worksheet.mergeCells('A03:C03');
        worksheet.mergeCells('D03:F03');
        worksheet.addRow([
          useMessages('record-export.name.min', lang),
          useMessages('record-export.name.avg', lang),
          useMessages('record-export.name.max', lang),
          useMessages('record-export.name.min', lang),
          useMessages('record-export.name.avg', lang),
          useMessages('record-export.name.max', lang),
        ]);
        worksheet.addRow([
          recordData.aggregates.minLeftSpeed,
          recordData.aggregates.avgLeftSpeed,
          recordData.aggregates.maxLeftSpeed,
          recordData.aggregates.minRightSpeed,
          recordData.aggregates.avgRightSpeed,
          recordData.aggregates.maxRightSpeed,
        ]);

        worksheet.getRow(6).values = [];
        worksheet.getCell('A7').value = useMessages('record-export.column.angle', lang);
        worksheet.getRow(8).values = [];
        worksheet.addRow([
          useMessages('record-export.name.min', lang),
          '',
          useMessages('record-export.name.avg', lang),
          '',
          useMessages('record-export.name.max', lang),
          '',
        ]);
        worksheet.mergeCells('A09:B09');
        worksheet.mergeCells('C09:D09');
        worksheet.mergeCells('E09:F09');

        worksheet.addRow([
          recordData.aggregates.minAngle,
          '',
          recordData.aggregates.avgAngle,
          '',
          recordData.aggregates.maxAngle,
          '',
        ]);
        worksheet.mergeCells('A10:B10');
        worksheet.mergeCells('C10:D10');
        worksheet.mergeCells('E10:F10');

        [
          'A03',
          'D03',
          'A04',
          'B04',
          'C04',
          'D04',
          'E04',
          'F04',
          'A05',
          'B05',
          'C05',
          'D05',
          'E05',
          'F05',
          'A09',
          'C09',
          'E09',
          'A10',
          'B10',
          'C10',
          'D10',
          'E10',
          'F10',
        ].map((key) => {
          worksheet.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'a7a8a9' },
          };
          worksheet.getCell(key).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(key).border = {
            top: { style: 'thin', color: { argb: 'ffffff' } },
            left: { style: 'thin', color: { argb: 'ffffff' } },
            bottom: { style: 'thin', color: { argb: 'ffffff' } },
            right: { style: 'thin', color: { argb: 'ffffff' } },
          };
        });
        break;
    }
  });

  let filename = `Recording_${recordData.sessionId}_${lang}.xlsx`;
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
