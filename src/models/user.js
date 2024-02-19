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
      user.hasMany(models.forgotPassword, {
        as: "token",
        foreignKey: "userId",
      });
      user.hasMany(models.transaksi, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      nama: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      alamat: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
