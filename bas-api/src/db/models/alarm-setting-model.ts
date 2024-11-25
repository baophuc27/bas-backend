import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import Berth from './berth-model';

interface AlarmSettingAttributes {
  id: number;
  berthId: number;
  alarmSensor: string;
  alarmType: string;
  alarmZone: string;
  operator: string;
  value?: number | null;
  statusId: number;
  message?: string | null;
  defaultValue?: number | null;
  orgId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AlarmSettingInput extends Optional<AlarmSettingAttributes, 'id'> {}
export interface AlarmSettingOutput extends Required<AlarmSettingAttributes> {}

class AlarmSetting
  extends Model<AlarmSettingAttributes, AlarmSettingInput>
  implements AlarmSettingAttributes
{
  public id!: number;
  public berthId!: number;
  public alarmSensor!: string;
  public alarmType!: string;
  public alarmZone!: string;
  public operator!: string;
  public value!: number | null;
  public message!: string | null;
  public defaultValue!: number | null;
  public statusId!: number;
  public orgId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

AlarmSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    berthId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alarmZone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alarmSensor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alarmType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    operator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    defaultValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'AlarmSetting',
    schema: 'bas',
    hooks: {},
  }
);

AlarmSetting.belongsTo(Berth, { foreignKey: 'berthId', as: 'berth' });

export default AlarmSetting;
