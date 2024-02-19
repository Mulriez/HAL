const userModel = require("../models").user;
const forgotPasswordModel = require("../models").forgotPassword;
const crypto = require("crypto");
const sendEmailHandle = require("../mail/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const dayjs = require("dayjs");
require("dotenv").config();

async function login(req, res) {
  try {
    const payload = req.body;
    const { username, password } = payload;
    const user = await userModel.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(422).json({
        status: "Fail",
        msg: "username tidak ditemukan, silahkan register",
      });
    }
    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Password & username beda",
      });
    }
    const verify = await bcrypt.compareSync(password, user.password);
    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "Password tidak cocok",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nama: user.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    await userModel.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    res.status(200).json({
      status: "Success",
      msg: "Login Berhasil",
      token: token,
      refresh_token: refreshToken,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function refreshToken(req, res) {
  try {
    res.status(500).json({
      status: "success",
      msg: "berhasil",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function register(req, res) {
  try {
    const payload = req.body;
    const { username, password, name, manager_id, address } = payload;
    let hashPassword = await bcrypt.hashSync(password, salt);
    await userModel.create({
      username,
      password: hashPassword,
      name,
      manager_id,
      address,
    });

    res.status(200).json({
      status: "Success",
      msg: `User berhasil dibuat`,
      data: payload
    });
  } catch (err) {
    console.log("error >>>>>>>", err);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

async function lupaPassword(req, res) {
  try {
    const { email } = req.body;
    //cek apakah user dengan email tsb terdaftar
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });
    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar
    if (user === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "email tidak ada, silahkan pakai yang sudah terdaftar",
      });
    }
    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currentToken = await forgotPasswordModel.findOne({
      where: {
        userId: user.id,
      },
    });
    // sudah hapus
    if (currentToken !== null) {
      await forgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }
    // jika belum buat token
    const token = crypto.randomBytes(32).toString("hex");
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await forgotPasswordModel.create({
      userId: user.id,
      token: token,
      expireDate: dayjs(expire).format("YYYY-MM-DD hh:mm:ss"),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/auth/reset-password/${user.id}/${token}`,
    };
    const sendEMail = await sendEmailHandle(
      email,
      "lupa password",
      "lupaPassword",
      context
    );
    if (sendEMail === "success") {
      res.status(201).json({
        status: "success",
        msg: "Silahkan cek email",
      });
    } else {
      console.log(">>>>>>>>>>>", sendEMail);
      res.status(403).json({
        status: "gagal",
        msg: "Gunakan email yg terdaftar",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
      error: error,
    });
  }
}
async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    const { id, token } = req.params;
    const currentToken = await forgotPasswordModel.findOne({
      where: { userId: id, token: token },
    });

    const user = await userModel.findOne({
      where: {
        id: id,
      },
    });

    if (currentToken === null) {
      res.status(403).json({
        status: "Fail",
        msg: "token invalid",
      });
    } else {
      let expired = currentToken.expiredDate;
      let expire = dayjs(Date());
      let difference = expire.diff(expired, "hour");
      if (difference !== 0) {
        res.json({
          status: "Fail",
          msg: "Token has expired",
        });
      } else {
        let hashPassword = await bcrypt.hash(newPassword, 10);
        await userModel.update(
          { password: hashPassword },
          {
            where: {
              id: user.id,
            },
          }
        );
        await forgotPasswordModel.destroy({ where: { token: token } });
        res.json({
          status: "Success",
          msg: "Password telah diupdate",
        });
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
      err: err,
      // token: currentToken
    });
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  lupaPassword,
  resetPassword,
};
