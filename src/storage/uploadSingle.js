const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Hanya izinkan format jpg dan png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung"), false);
  }
};

const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 }, // Batasan ukuran file (1 MB)
  fileFilter: fileFilter, // Menggunakan filter file
}).single("file");

module.exports = uploadSingle;
