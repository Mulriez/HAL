const express = require("express");
const {
  login,
  lupaPassword,
  resetPassword,
  register,
  refreshToken,
} = require("../controller/AuthControllers");

const router = express.Router();
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const { getUser } = require("../controller/userController");
const { getProduk, createProduk } = require("../controller/produkController");
const {
  getTransaksi,
  createTransaksi,
} = require("../controller/transaksiController");
const { getBayar } = require("../controller/bayarController");
//auth
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/token", refreshToken);
//update password
router.post("/auth/lupa-password", lupaPassword);
router.put("/auth/reset-password/:id/:token", resetPassword);
//jwt
router.use(jwtValidateMiddleware);
//user
router.get("/user/list",jwtValidateMiddleware, getUser);
//produk
router.get("/produk/list", getProduk);
router.post("/produk/create", createProduk);
//transaksilm\
router.get("/transaksi/list", getTransaksi);
router.post("/transaksi/create", createTransaksi);
//bayar
router.get("/bayar/list", getBayar)

module.exports = router;
