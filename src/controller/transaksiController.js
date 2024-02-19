const transaksiModel = require("../models").transaksi;2
const { Op } = require("sequelize");
const checkQuery = require("../utils/queryString");

async function getTransaksi(req, res) {
  const { page, offset, pageSize, keyword } = req.query;
  try {
    const transaksi = await transaksiModel.findAndCountAll({
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              tanggal: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: ["id", "userId", "produkId", "tanggal", "keterangan"],
      offset: offset,
      limit: pageSize,
    });

    res.json({
      status: "success",
      msg: "Transaksi Ditemukan",
      data: transaksi.rows,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: transaksi.count,
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

async function createTransaksi(req, res) {
  try {
    const payload = req.body;
    let { id, userId, produkId, tanggal, keterangan } = payload;
    const transaksi = await transaksiModel.create({
      id,
      userId,
      produkId,
      tanggal,
      keterangan,
    });
    console.log(transaksi instanceof transaksiModel);
    res.status(201).json({
      status: "Success",
      message: "Transaksi berhasil dibuat",
      data: transaksi,
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
  getTransaksi,
  createTransaksi
};

