const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const express = require("express");
const app = new express();
const port = process.env.PORT || 8080;
const Router = require("./router/router");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Router);

app.listen(port, () => {
  console.log(`listing to port no. ${port}`);
});
