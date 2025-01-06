import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import { Record } from './index';

interface RecordHistoryAttributes {
  id: number;
  recordId: number;
  time: Date;

  orgId: number;
  berthId: number;

  leftDistance?: number | null;
  leftSpeed?: number | null;
  rightDistance?: number | null;
  rightSpeed?: number | null;
  angle?: number | null;

  angleZone?: number | null;
  LSpeedZone?: number | null;
  LDistanceZone?: number | null;
  RDistanceZone?: number | null;
  RSpeedZone?: number | null;

  leftStatus?: number; // 0 : dis , 1 : con , 2 : fail
  rightStatus?: number; // 0 : dis , 1 : con , 2 : fail

  RDistanceAlarm?: number | null;
  LDistanceAlarm?: number | null;
  RSpeedAlarm?: number | null;
  LSpeedAlarm?: number | null;
  angleAlarm?: number | null;

  record?: Record;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RecordHistoryInput extends Optional<RecordHistoryAttributes, 'id'> {}
export interface RecordHistoryOutput extends Required<RecordHistoryAttributes> {}

class RecordHistory
  extends Model<RecordHistoryAttributes, RecordHistoryInput>
  implements RecordHistoryAttributes
{
  public id!: number;
  public recordId!: number;
  public time!: Date;
  public berthId!: number;
  public orgId!: number;

  public leftSpeed?: number | null;
  public leftDistance?: number | null;
  public rightSpeed?: number | null;
  public rightDistance?: number | null;
  public angle?: number | null;

  public angleZone?: number | null;
  public LSpeedZone?: number | null;
  public RSpeedZone?: number | null;
  public LDistanceZone?: number | null;
  public RDistanceZone?: number | null;

  public RDistanceAlarm?: number | null;
  public LDistanceAlarm?: number | null;
  public RSpeedAlarm?: number | null;
  public LSpeedAlarm?: number | null;
  public angleAlarm?: number | null;

  public leftStatus!: number;
  public rightStatus!: number;

  public record?: Record;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

RecordHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    berthId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    angleZone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LSpeedZone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LDistanceZone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RDistanceZone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RSpeedZone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leftSpeed: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    leftDistance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    rightSpeed: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    rightDistance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    angle: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    leftStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rightStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RDistanceAlarm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LDistanceAlarm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RSpeedAlarm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LSpeedAlarm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    angleAlarm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'RecordHistory',
    schema: 'bas',
    hooks: {
    },
    indexes: [
      {
        fields: ['time'],
      },
    ],
  }
);

// event time is index

RecordHistory.addScope('defaultScope', {});

export default RecordHistory;
