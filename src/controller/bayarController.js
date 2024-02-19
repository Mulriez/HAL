const bayarModel = require("../models").bayar;
const { Op } = require("sequelize");
const checkQuery = require("../utils/queryString");

async function getBayar(req, res) {
  const { page, offset, pageSize, keyword } = req.query;
  try {
    const bayar = await bayarModel.findAndCountAll({
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              tgl_bayar: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: ["id", "id_transaksi", "total", "tgl_bayar"],
      offset: offset,
      limit: pageSize,
    });

    res.json({
      status: "success",
      msg: "Pembayaran Ditemukan",
      data: bayar.rows,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: bayar.count,
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

module.exports = {
    getBayar
};