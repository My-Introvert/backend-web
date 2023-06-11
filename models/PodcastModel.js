import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Podcast = db.define(
  "podcast",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 300],
      },
    },
    sumarry: {
      type: DataTypes.TEXT,
      validate: {
        len: [15, 1000],
      },
    },
    audio: DataTypes.STRING,
    urlAudio: DataTypes.STRING,
    image: DataTypes.STRING,
    urlImage: DataTypes.STRING,
    label: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Podcast);
Podcast.belongsTo(Users, { foreignKey: "userId" });

export default Podcast;
