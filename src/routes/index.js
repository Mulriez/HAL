const express = require("express");
const {
  login,
  register,
  refreshToken,
} = require("../controller/AuthController");

const router = express.Router();
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const { getUser, getUserID } = require("../controller/userController");
const {
  getAbsen,
  createAbsenIn,
  getAbsent,
  createAbsentIn,
  getAbsentByUserId,
} = require("../controller/Absencontroller");
const uploadSingle = require("../storage/uploadSingle");
//auth
router.post("/api/login", login);
router.post("/api/register", register);
router.get("/token", refreshToken);
//jwt
router.use(jwtValidateMiddleware);
//user
router.get("/api/user", getUser);
router.get("/api/user/:id", getUserID);
//absen
router.get("/api/absent/:id", getAbsent);
router.get("/api/absent", getAbsentByUserId);
router.post("/api/absent-in", uploadSingle, createAbsentIn);

module.exports = router;
