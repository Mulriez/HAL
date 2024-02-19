const produkModel = require("../models").produk;
const { Op } = require("sequelize");
const checkQuery = require("../utils/queryString");

async function getProduk(req, res) {
  const { page, offset, pageSize, keyword } = req.query;
  try {
    const produk = await produkModel.findAndCountAll({
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              nama: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: ["id", "nama", "harga", "rating", "stok"],
      offset: offset,
      limit: pageSize,
    });

    res.json({
      status: "success",
      msg: "Produk Ditemukan",
      data: produk.rows,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: produk.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function createProduk(req, res) {
  try {
    const payload = req.body;
    let { id, nama, harga, rating, stok } = payload;
    const produk = await produkModel.create({
      id,
      nama,
      harga,
      rating,
      stok,
    });
    console.log(produk instanceof produkModel);
    res.status(201).json({
      status: "Success",
      message: "Produk berhasil ditambah",
      data: produk,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "Ada kesalahan",
      error: error,
    });
  }
}

module.exports = {
  getProduk,
  createProduk,
};
