import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../connection';


interface VesselAttributes {
  id : number;
  code: string
  name: string;
  nameEn: string;
  flag: string;
  length: number;
  beam: number;

  type?: string | null;
  builder?: string | null;
  built?: string | null;
  owner?: string | null;
  manager?: string | null;
  maxDraught?: string | null;
  class?: string | null;
  nt?: string | null;
  gt?: string | null;
  teu?: string | null;
  dwt?: number | null;
  gas?: number | null;
  crude?: number | null;
  longitude?: number | null;
  latitude?: number | null;
  heading?: string | null;
  speed?: number | null;
  callSign?: string | null;
  shape?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VesselInput extends Optional<VesselAttributes, 'id'> {}
export interface VesselOutput extends Required<VesselAttributes> {}

class Vessel extends Model<VesselAttributes, VesselInput> implements VesselAttributes {
  public id!: number;
  public code!: string
  public name!: string;
  public nameEn!: string;
  public flag!: string;
  public length!: number;
  public beam!: number;

  public type!: string | null;
  public builder!: string | null;
  public built!: string | null;
  public owner!: string | null;
  public manager!: string | null;
  public maxDraught!: string | null;
  public class!: string | null;
  public nt!: string | null;
  public gt!: string | null;
  public teu!: string | null;
  public dwt!: number | null;
  public gas!: number | null;
  public crude!: number | null;
  public longitude!: number | null;
  public latitude!: number | null;
  public heading!: string | null;
  public speed!: number | null;
  public callSign!: string | null;
  public shape!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Vessel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    beam: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    builder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    built: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manager: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxDraught: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dwt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    crude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speed: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    callSign: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shape: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Vessel',
    schema: 'bas',
  }
);



export default Vessel;
