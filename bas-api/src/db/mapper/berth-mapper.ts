import { BerthStatus, getBerthStatusMessages } from '@bas/constant/berth-status';

export const berthDetailMapper = {
  id : 'id',
  name : 'name',
  nameEn : 'nameEn',
  description : 'description',
  directionCompass: 'directionCompass',
  limitZone1 : 'limitZone1',
  limitZone2 : 'limitZone2',
  limitZone3 : 'limitZone3',
  distanceFender : 'distanceFender',
  vesselDirection : 'vesselDirection',
  distanceDevice : 'distanceDevice',
  "vessel.id": "currentVessel.id",
  "vessel.name": "currentVessel.name",
  "vessel.code": "currentVessel.code",
  "vessel.nameEn": "currentVessel.nameEn",
  'leftDevice.id': 'leftDevice.id',
  'leftDevice.name': 'leftDevice.name',
  'leftDevice.status': 'leftDevice.status',
  'leftDevice.realValue': 'leftDevice.realValue',
  'rightDevice.id': 'rightDevice.id',
  'rightDevice.name': 'rightDevice.name',
  'rightDevice.realValue': 'rightDevice.realValue',
  'rightDevice.status': 'rightDevice.status',
  'distanceToLeft' : 'distanceToLeft',
  'distanceToRight' : 'distanceToRight',
  status : {
    key : 'status',
    transform : (status : number) => {
      return {
        id : status,
        ...getBerthStatusMessages(Object.values(BerthStatus)[status])
      };
    }
  }
}