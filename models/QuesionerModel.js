import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Quesioner = db.define(
  "quesioners",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Data
    yourIntrovert: DataTypes.STRING,
    levelIntrovert: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    status: DataTypes.STRING,
    publicSpeaking: DataTypes.STRING,
    leadership: DataTypes.STRING,
    meetStrangers: DataTypes.STRING,
    crowd: DataTypes.STRING,
    oldFriends: DataTypes.STRING,
    onlineActivities: DataTypes.STRING,
    offlineActivities: DataTypes.STRING,
    // End Data
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

Users.hasMany(Quesioner);
Quesioner.belongsTo(Users, { foreignKey: "userId" });

export default Quesioner;
