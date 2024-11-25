import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import { Record } from './index';
import Sensor from './sensor-model';

interface AlarmAttributes {
  id: number;
  recordId: number;
  startTime: Date;
  endTime?: Date | null;
  value?: number | null;
  alarm: number;
  type: string;
  side?: number | null;
  zone?: number | null;
  sensorId?: number | null;
  orgId: number;
  record?: Record;
  sensor?: Sensor;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

}

export interface AlarmInput extends Optional<AlarmAttributes, 'id'> {
}

export interface AlarmOutput extends Required<AlarmAttributes> {
}

class Alarm extends Model<AlarmAttributes, AlarmInput> implements AlarmAttributes {
  public id!: number;
  public recordId!: number;
  public endTime?: Date | null;
  public alarm!: number;
  public sensorId?: number;
  public side?: number | null;
  public startTime!: Date;
  public type!: string;
  public value?: number | null;
  public zone?: number | null;
  public sensor?: Sensor;
  public record?: Record;
  public orgId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Alarm.init(
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    zone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    alarm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sensorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    side: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orgId: {
      // Cấu hình orgId
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Alarm',
    schema: 'bas',
    hooks: {},
    indexes: [
      {
        fields: ['startTime'],
      },
    ],
  }
);

// event time is index

Alarm.belongsTo(Record, {
  foreignKey: 'recordId',
  as: 'record',
  targetKey: 'id',
  constraints: false
});

Alarm.belongsTo(Sensor, {
  foreignKey: 'sensorId',
  as: 'sensor',
  targetKey: 'id',
  constraints: false
});



export default Alarm;
