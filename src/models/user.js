"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.absen1, {
        as: "absen",
        foreignKey: "user_id",
      });
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      manager_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
