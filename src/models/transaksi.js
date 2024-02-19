'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaksi.hasMany(models.bayar, {
        as: "bayar",
        foreignKey: "id_transaksi",
      });
      transaksi.belongsTo(models.user, {
        as: "user",
        foreignKey: "userId",
      });
      transaksi.belongsTo(models.produk, {
        as: "produk",
        foreignKey: "userId",
      });
    }
  }
  transaksi.init({
    userId: DataTypes.INTEGER,
    produkId: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};