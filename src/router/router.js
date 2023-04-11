const express = require("express");
const router = new express();
const auth = require("../middleware/auth");
const usrCtrl = require("../controller/userController");

require("../db/conn");

// router.get("/", (req, res) => {
//   res.send("Server Connected again");
// });

router.post("/register", usrCtrl.RegisterUser);

router.post("/login", usrCtrl.LoginUser);

router.get("/allusersdata", usrCtrl.AllUserData);

router.patch("/reset_password", usrCtrl.RegisterUser);

router.get("/authicate", auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
