const absenModel = require("../models").absentin;
const { post, del } = require("./cloudinaryController");
const { Op } = require("sequelize");
const checkQuery = require("../utils/queryString");


//absent_in
async function getAbsent(req, res) {
  const { id } = req.params;
  try {
    const absen = await absenModel.findByPk(id);

    if (!absen) {
      return res.status(404).json({
        status: "Fail",
        msg: "Absen tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      msg: "Absen Ditemukan",
      data: absen,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function getAbsentByUserId(req, res) {
  const { page, offset, pageSize, keyword } = req.query;
  try {
    const absen = await absenModel.findAndCountAll({
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              user_id: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: [
        "id",
        "user_id",
        "clock_in",
        "latitude_in",
        "longitude_in",
        "selfie_in",
      ],
      offset: offset,
      limit: pageSize,
    });

    if (!absen) {
      return res.status(404).json({
        status: "Fail",
        msg: "Absen tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      msg: "Absen Ditemukan",
      data: absen.rows,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: absen.count,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
}

async function createAbsentIn(req, res) {
  try {
    const payload = req.body;
    let { user_id, clock_in, latitude_in, longitude_in } = payload;
    const { secure_url, public_id } = await post(req.file.path, "selfie");
    selfie_in = secure_url;
    thumbnail_id = public_id;
    const absen = await absenModel.create({
      user_id,
      clock_in,
      latitude_in,
      longitude_in,
      selfie_in,
      thumbnail_id,
    });
    console.log(absen instanceof absenModel);
    res.status(201).json({
      status: "Success",
      message: "Absen berhasil dibuat",
      data: absen,
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
  getAbsent,
  getAbsentByUserId,
  createAbsentIn,
};
