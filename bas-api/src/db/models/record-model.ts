import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import Berth from './berth-model';
import Vessel from './vessel-model';
import RecordHistory from './record-history-model';

interface RecordAttributes {
  id: number;
  orgId: number; // Add this
  berthId: number;
  vesselId: number;
  sessionId: string;
  startTime: Date;
  endTime?: Date | null;
  mooringStatus?: string | null;
  syncStatus: string;

  directionCompass?: number;
  distanceFender?: number;
  distanceDevice?: number;
  distanceToLeft?: number;
  distanceToRight?: number;

  vesselDirection?: number;

  limitZone1?: number;
  limitZone2?: number;
  limitZone3?: number;

  doneAlarm?: boolean;

  berth?: Berth;
  vessel?: Vessel;

  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RecordInput extends Optional<RecordAttributes, 'id'> {}
export interface RecordOutput extends Required<RecordAttributes> {}

class Record extends Model<RecordAttributes, RecordInput> implements RecordAttributes {
  public id!: number;
  public orgId!: number; // Add this
  public berthId!: number;
  public vesselId!: number;
  public sessionId!: string;
  public startTime!: Date;
  public endTime?: Date | null;
  public mooringStatus?: string | null;
  public syncStatus!: string;

  public doneAlarm?: boolean;

  public directionCompass?: number;
  public distanceFender?: number;
  public distanceDevice?: number;
  public distanceToLeft?: number;
  public distanceToRight?: number;

  public vesselDirection?: number;
  public limitZone1?: number;
  public limitZone2?: number;
  public limitZone3?: number;

  public berth?: Berth;
  public vessel?: Vessel;

  public readonly createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Record.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    berthId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vesselId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vesselDirection: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    distanceFender: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    distanceDevice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    distanceToLeft: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    distanceToRight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    directionCompass: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    limitZone1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    limitZone2: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    limitZone3: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    doneAlarm: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    mooringStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    syncStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Record',
    schema: 'bas',
    hooks: {
      beforeCreate: (record: any) => {
        if (!record.orgId) {
          throw new Error('orgId is required but missing in payload.');
        }
      }
    }
  }
);

Record.belongsTo(Berth, { foreignKey: 'berthId', as: 'berth' });
Record.belongsTo(Vessel, { foreignKey: 'vesselId', as: 'vessel' });

RecordHistory.belongsTo(Record, { foreignKey: 'recordId', as: 'record' });
Record.hasMany(RecordHistory, { foreignKey: 'recordId', as: 'recordHistory' });

export default Record;
