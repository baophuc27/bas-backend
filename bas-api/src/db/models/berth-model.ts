import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import { Sensor, User, Vessel } from './index';

interface BerthAttributes {
  id: number;
  orgId: number;
  name: string;
  nameEn: string;
  description: string;
  status?: number;
  shape?: string;
  directionCompass?: number;
  limitZone1?: number;
  limitZone2?: number;
  limitZone3?: number;
  vesselId?: number;
  distanceFender?: number;
  distanceDevice?: number;
  modifiedBy?: string;
  vesselDirection?: boolean;

  leftDeviceId?: number;
  rightDeviceId?: number;
  distanceToLeft?: number;
  distanceToRight?: number;

  leftDevice?: Sensor;
  rightDevice?: Sensor;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BerthInput extends Optional<BerthAttributes, 'id'> {}
export interface BerthOutput extends Required<BerthAttributes> {}

class Berth extends Model<BerthAttributes, BerthInput> implements BerthAttributes {
  public id!: number;
  public orgId!: number;
  public name!: string;
  public nameEn!: string;
  public description!: string;
  public status?: number;
  public shape?: string;
  public limitZone1?: number;
  public limitZone2?: number;
  public limitZone3?: number;
  public vesselId?: number;

  public directionCompass?: number;
  public distanceFender?: number;
  public distanceDevice?: number;
  public vesselDirection?: boolean;
  public distanceToLeft?: number;
  public distanceToRight?: number;

  public leftDeviceId?: number;
  public rightDeviceId?: number;

  public leftDevice?: Sensor;
  public rightDevice?: Sensor;

  public modifiedBy?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Berth.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    shape: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    directionCompass: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vesselDirection: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    vesselId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leftDeviceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rightDeviceId: {
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
    modifiedBy: {
      type: DataTypes.UUID,
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
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Berth',
    schema: 'bas',
    hooks: {
    },
  }
);

Berth.belongsTo(Sensor, {
  foreignKey: 'leftDeviceId',
  as: 'leftDevice',
  targetKey: 'id',
  constraints: false,
});
Berth.belongsTo(Sensor, {
  foreignKey: 'rightDeviceId',
  as: 'rightDevice',
  targetKey: 'id',
  constraints: false,
});
Berth.belongsTo(Vessel, { foreignKey: 'vesselId', as: 'vessel', constraints: false });
Berth.belongsTo(User, {
  foreignKey: 'modifiedBy',
  as: 'user',
  constraints: false,
});

export default Berth;
