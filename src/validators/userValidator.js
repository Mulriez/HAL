const { check } = require("express-validator");
const userModel = require("../models").user;

const createUserValidator = [
  check("nama")
    .isLength({ min: 1 })
    .withMessage("Wajib isi, minimal satu lah..."),
  check("email")
    .isEmail()
    .withMessage("Pakai format email lah...")
    .custom((value) => {
      return userModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail nya udah kepake");
        }
      });
    }),
];
const updateUserValidator = [
  check("nama")
    .isLength({ min: 1 })
    .withMessage("Wajib isi, minimal satu lah..."),
];
const registerValidator = [
  check("email")
    .isLength({ min: 1 })
    .withMessage("Wajib isi, minimal satu lah..."),
];
const updateValidator = [
  check("new_password")
    .isLength({ min: 8 })
    .withMessage("password minimal 8 char"),
];

module.exports = { createUserValidator, updateUserValidator, updateValidator };