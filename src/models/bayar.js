'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bayar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bayar.init({
    id_transaksi: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    tgl_bayar: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'bayar',
  });
  return bayar;
};