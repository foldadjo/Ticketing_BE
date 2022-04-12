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

// // Jika ingin menyimpan data di dalam project backend
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/movie");
//   },
//   filename(req, file, cb) {
//     console.log(file);
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

const upload = multer({ storage }).single("image");

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
