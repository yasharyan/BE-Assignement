const mongoose = require("mongoose");
const DB = process.env.MONGO_URI;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful...");
  })
  .catch((e) => {
    console.log(e);
  });
