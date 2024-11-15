import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelizeConnection from '../connection';
import User from './user-model';

interface AccountAttributes {
  username: string;
  passwordHash: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AccountInput extends Optional<AccountAttributes, 'userId'> {}
export interface AccountOutput extends Required<AccountAttributes> {}

class Account extends Model<AccountAttributes, AccountInput> implements AccountAttributes {
  public username!: string;
  public passwordHash!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Account.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Account',
    schema: 'bas',
    hooks: {
      beforeCreate: async (user) => {
        const saltRound = 12;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRound);
      },
    },
  }
);

Account.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  constraints: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default Account;

