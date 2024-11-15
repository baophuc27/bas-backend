import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';

interface SensorAttributes {
  id: number;
  name: string;
  status?: number;
  realValue?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface SensorInput extends Optional<SensorAttributes, 'id'> {}
export interface SensorOutput extends Required<SensorAttributes> {}

class Sensor extends Model<SensorAttributes, SensorInput> implements SensorAttributes {
  public id!: number;
  public name!: string;
  public status?: number;
  public realValue?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Sensor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    realValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Sensor',
    schema: 'bas',
  }
);

export default Sensor;
