const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// Jika ingin menyimpan data di cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tiketjauhar/user",
  },
});

const maxSize = 10048576;

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (
      !(
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/gif"
      )
    ) {
      return cb(new Error("Only .png, .jpg .jpeg and .gif format allowed!"));
    }

    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 10048576) {
      return cb(new Error("file must be under 10 MB"));
    }
    cb(null, true);
  },
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.messege, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.messege, null);
    }
    return next();
  });
};

module.exports = handlingUpload;
