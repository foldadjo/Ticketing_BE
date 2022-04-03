const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "fazztrack",
  api_key: "798639787589556",
  api_secret: "e1VhAMRE8T7KH8PvxK2eBtIqfmo",
});

module.exports = cloudinary;
