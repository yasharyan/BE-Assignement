const express = require("express");
const router = new express();
const usrCtrl = require("../controller/userController");

require("../db/conn");

router.post("/register", usrCtrl.RegisterUser);

router.post("/login", usrCtrl.LoginUser);

router.get("/allusersdata", usrCtrl.AllUserData);

router.patch("/reset_password", usrCtrl.ResetPassword);

module.exports = router;
