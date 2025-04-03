import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';
import Berth from './berth-model';

interface DataAppAttributes {
  code: string;
  orgId: number;
  berthId?: number | null;
  status?: string | null;
  displayName?: string | null;
  lastHeartbeat?: Date | null;
  lastDataActive?: Date | null;
  createdAt?: Date | null;
  berth?: Berth;
  type? : string | null;
}

export interface DataAppInput extends Optional<DataAppAttributes, 'code'> {}
export interface DataAppOutput extends Required<DataAppAttributes> {}

class DataApp extends Model<DataAppAttributes, DataAppInput> implements DataAppAttributes {
  public code!: string;
  public orgId!: number;
  public berthId?: number | null;
  public status?: string | null;
  public displayName?: string | null;
  public lastHeartbeat?: Date | null;
  public lastDataActive?: Date | null;
  public createdAt?: Date | null;
  public berth?: Berth;
  public type? : string | null;
}

DataApp.init(
  {
    code: {
      type: DataTypes.CHAR(4),
      primaryKey: true,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    berthId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastHeartbeat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastDataActive: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },

  {
    timestamps: false, // Since there are no timestamp columns in the DDL
    sequelize: sequelizeConnection,
    tableName: 'DataApp',
    schema: 'bas',
    indexes: [
      {
        name: 'idx_dataapp_org_id',
        fields: ['orgId'],
      }
    ]
  }
);
DataApp.belongsTo(Berth,{
  foreignKey: "berthId",
  as: "berth",
  targetKey: 'id',
  constraints: false
});



export default DataApp;