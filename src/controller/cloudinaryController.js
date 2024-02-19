const { v2 } = require( "cloudinary");
require("dotenv").config();
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function post(file, folder) {
  return new Promise((resolve, reject) => {
    v2.uploader
      .upload(file, {
        folder: `/myKantin/${folder}`,
        use_filename: true,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((er) => {
        reject(er);
      });
  });
}
async function del(id) {
  return new Promise((resolve, reject) => {
    v2.uploader
      .destroy(id)
      .then((res) => resolve(res))
      .catch((er) => reject(er));
  });
}

module.exports = { post, del };
