import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import User from './user-model';

interface RefreshTokenAttributes {
  id: number;
  userId: string;
  token: string;
  expires: Date;
  revoked?: Date | null;
  revokedByIp?: string;
  replaceByToken?: string;
  createdByIp?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RefreshTokenInput extends Optional<RefreshTokenAttributes, 'id'> {}
export interface RefreshTokenOutput extends Required<RefreshTokenAttributes> {}

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenInput>
  implements RefreshTokenAttributes
{
  public id!: number;
  public userId!: string;
  public token!: string;
  public expires!: Date;
  public revoked!: Date | null;
  public revokedByIp!: string;
  public replaceByToken!: string;
  public createdByIp!: string;

  public user?: User;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public isActive: boolean = this.revoked == null;

}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    revokedByIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    replaceByToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdByIp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: 'RefreshToken',
    schema: 'bas',
  }
);

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  constraints: false,
});

export default RefreshToken;
