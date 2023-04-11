require("dotenv").config();
const express = require("express");
const app = new express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const Router = require("./src/router/router");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Router);

app.listen(port, () => {
  console.log(`listing to port number. ${port}`);
});
