const { post, del } = require("../controller/cloudinaryController");
const userModel = require("../models").user;
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
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
              nama: { [Op.substring]: keyword },
            },
          ],
        }),
      },
      attributes: ["id", "email", "nama"],
      offset: offset,
      limit: pageSize,
    });
    res.status(201).json({
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

async function getUserDetail(req, res) {
  const { id } = req.params;
  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
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

async function createUser(req, res) {
  try {
    const payload = req.body;
    const { email, nama, role, password } = payload;
    let hashPassword = await bcrypt.hashSync("12345678", salt);
    await userModel.create({
      email,
      password: hashPassword,
      nama,
      role,
    });

    res.status(201).json({
      status: "Success",
      msg: `User berhasil dibuat`,
      data: payload,
    });
  } catch (err) {
    console.log(">>>>>", err);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function createUserBulk(req, res) {
  try {
    const payload = req.body.user;
    let hashPassword = await bcrypt.hashSync("12345678", 10);
    let berhasil = 0;
    let gagal = 0;

    await Promise.all(
      payload.map(async (item) => {
        try {
          await userModel.create({
            email: item.email,
            password: hashPassword,
            nama: item.nama,
            role: item.role,
          });
          berhasil = berhasil + 1;
        } catch (err) {
          gagal = gagal + 1;
        }
      })
    );

    res.json({
      status: "Success",
      msg: `User berhasil dibuat sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
    });
  } catch (err) {
    console.log("===========");
    console.log(err);
    console.log("===========");
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    let { email, nama, role } = payload;

    const user = await userModel.findByPk(id);

    if (user === null) {
      return res.status(404).json({
        status: "fail",
        msg: `User tidak ditemukan`,
      });
    }

    let picture = user.picture; // Tetapkan foto yang sudah ada sebagai default

    if (req.file) {
      // Jika ada file yang diunggah, ganti foto dengan yang baru
      const { secure_url, public_id } = await post(
        req.file.path,
        "photo profile"
      );
      picture = secure_url;
      const thumbnailId = public_id;

      if (user.thumbnailId) {
        // Hapus foto lama jika ada
        await del(user.thumbnailId);
      }
    }

    await userModel.update(
      {
        picture,
        email,
        nama,
        role,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({
      status: "Success",
      msg: "User telah diupdate",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

//delete
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findByPk(id);

    if (user === null) {
      return res.status(404).json({
        status: "failed",
        msg: `User tidak ditemukan`,
      });
    }

    if (user.thumbnailId) {
      // Memeriksa apakah user.thumbnailId ada sebelum menghapusnya
      await del(user.thumbnailId);
    }

    // Menghapus pengguna
    await userModel.destroy({
      where: {
        id: id,
      },
    });

    res.status(201).json({
      status: "Success",
      msg: "User dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function deleteUserBulk(req, res) {
  try {
    let payload = req.body.user;
    let berhasil = 0;
    let gagal = 0;

    // Memeriksa apakah user.thumbnailId ada sebelum menjalankan fungsi del
    if (req.user && req.user.thumbnailId) {
      await del(req.user.thumbnailId);
    }

    await Promise.all(
      payload?.map(async (item) => {
        try {
          await userModel.destroy({
            where: {
              id: item,
            },
          });
          berhasil = berhasil + 1;
        } catch (err) {
          gagal = gagal + 1;
          console.log(err);
        }
      })
    );

    res.json({
      status: "Success",
      msg: `User berhasil dihapus sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

module.exports = {
  getUser,
  getUserDetail,
  createUser,
  createUserBulk,
  updateUser,
  deleteUser,
  deleteUserBulk,
};
