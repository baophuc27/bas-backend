import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';

interface HarborAttributes {
  id: number;
  orgId: number;
  name: string;
  nameEn: string;
  description: string;
  address: string;
  weatherWidgetUrl?: string;
  weatherWidgetDashboardUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Update input type to include all editable fields
export type HarborInput = {
  name: string;
  nameEn: string;
  description: string;
  address: string;
  weatherWidgetUrl?: string;
  weatherWidgetDashboardUrl?: string;
  orgId: number;
};

export interface HarborOutput extends Required<HarborAttributes> {}

class Harbor extends Model<HarborAttributes, HarborInput> implements HarborAttributes {
  public id!: number;
  public orgId!: number;
  public name!: string;
  public nameEn!: string;
  public description!: string;
  public address!: string;
  public weatherWidgetUrl?: string;
  public weatherWidgetDashboardUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Harbor.init(
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weatherWidgetUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weatherWidgetDashboardUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Harbor',
    schema: 'bas',
    hooks: {
    },
  }
);

export default Harbor;
