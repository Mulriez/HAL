const nodemailer = require("nodemailer");
require("dotenv").config();
const hbs = require("nodemailer-express-handlebars");
const path = require("path");


const sendEmailHandle = async (email, subject, template, context) => {
  try {
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./src/mail"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/mail"),
    };
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure : true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    transporter.use("compile", hbs(handlebarOptions));
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Tidak terkoneksi ke Server ", error);
      } else {
        console.log("Server terkoneksi, sudah bisa mengirimkan email");
      }
    });

    try {
      await transporter.sendMail({
        from: "Kantin Simulator<latihan-email@smkmadinatulquran.sch.id>",
        to: email,
        subject: subject,
        template: template,
        context: context,
      });

      return "success"
    } catch (err) {
      return "gagal";
    }


  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports = sendEmailHandle;
