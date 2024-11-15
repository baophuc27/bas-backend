import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelizeConnection from '../connection';

interface RoleAttributes {
  id: number;
  name: string;
  code : string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleInput extends Optional<RoleAttributes, 'id'> {}
export interface RoleOutput extends Required<RoleAttributes> {}

class Role extends Model<RoleAttributes, RoleInput> implements RoleAttributes {
  public id!: number;

  public name!: string;
  public code!: string;
  public description!: string;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: 'Role',
    schema: 'bas',
  }
);

export default Role;
