import { APP_HOST } from '@bas/config';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelizeConnection from '../connection';
import Role from './role-model';
import { VNEMISOFT_API } from '@bas/config';

interface UserAttributes {
  id: string;
  originalId: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  roleId: number;
  roleName?: string;
  permission: string;
  orgId: number;
  orgName?: string;
  avatar?: string;
  orgLogo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  isActive?: boolean;
}

export interface UserInput extends Optional<UserAttributes, 'id'> { }
export interface UserOutput extends Required<UserAttributes> { }

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public phone?: string;
  public roleId!: number;
  public roleName?: string;
  public fullName!: string;
  public permission!: string;
  public orgId!: number;
  public avatar?: string;
  public orgName?: string;
  public orgLogo?: string;
  public originalId!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Updated permission field to text for larger storage
    permission: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orgName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orgLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'User',
    schema: 'bas',
    hooks: {
      beforeCreate: async (user) => {
        user.id = uuidv4();
      },
    },
  }
);

User.addScope(
  'defaultScope',
  {
    attributes: {
      exclude: ['deletedAt'],
      include: [
        [
          Sequelize.literal(
            `CASE WHEN avatar IS NOT NULL THEN concat('${VNEMISOFT_API}/', avatar) ELSE NULL END`
          ),
          'avatar',
        ],
        [
          Sequelize.literal(
            `CASE WHEN "orgLogo" IS NOT NULL THEN concat('${VNEMISOFT_API}/', "orgLogo") ELSE NULL END`
          ),
          'orgLogo',
        ],
      ],
    },
  },
  { override: false }
);

User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
  onDelete: 'NO ACTION',
  constraints: false,
});

export default User;
