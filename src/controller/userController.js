const userModel = require("../models").user;
const { Op } = require("sequelize");
const checkQuery = require("../utils/queryString");

async function getUser(req, res) {
  const { page, offset, pageSize, keyword } = req.query;
  try {
    const user = await userModel.findAndCountAll({
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              manager_id: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: ["id", "username", "name", "address"],
      offset: offset,
      limit: pageSize,
    });
    res.json({
      status: "success",
      msg: "User Ditemukan",
      data: user.rows,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: user.count,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function getUserID(req, res) {
  const { id } = req.params;
  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.json({
        status: "failed",
        msg: "User tidak ditemukan",
      });
    }

    res.status(201).json({
      status: "success",
      msg: "User Ditemukan",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

module.exports = {
  getUser,
  getUserID
};
