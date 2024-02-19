'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Senquelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      produk.hasMany(models.transaksi, {
        as: "produk",
        foreignKey: "produkId",
      });
    }
  }
  produk.init({
    nama: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    stok: DataTypes.INTEGER,
    rating: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'produk',
  });
  return produk;
};