const User = require("../model/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
  const { name, email, password, confirm_password, phone, date_of_birth } =
    req.body;
  var regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (
    !name ||
    !email ||
    !password ||
    !confirm_password ||
    !phone ||
    !date_of_birth
  ) {
    return res.status(422).json({ error: "Please fill all the fileds" });
  }

  if (phone.length != 10)
    return res.status(422).json({ error: "Please fill valid phone number" });

  if (!password.match(regularExpression))
    return res.status(422).json({
      error:
        "Password should contain lenght of 8-16, 1 uppercase, 1 lowercase, 1 symbol, 1 number",
    });
  try {
    const emailExist = await User.findOne({ email: email });
    const phoneExist = await User.findOne({ phone: phone });

    if (emailExist || phoneExist) {
      return res.status(423).json({
        error: `Email or Phone Already in Use, Please Register with another details`,
      });
    } else if (password != confirm_password) {
      return res.status(424).json({ error: "passwords are not matching" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcrypt_password = await bcrypt.hash(req.body.password, salt);
      const register = new User({
        name,
        email,
        phone,
        date_of_birth,
        password: bcrypt_password,
      });
      const payload = {
        email: register.email,
        name: register.name,
      };
      const token = jwt.sign(payload, process.env.SERCETE_KEY, {
        expiresIn: 36000,
      });

      await register.save();
      return res.status(201).json({
        status: 201,
        message: "User registered Successfully",
        data: {
          name: register.name,
          email: register.email,
          phone: register.phone,
          date_of_birth: register.date_of_birth,
          token,
        },
      });
    }
  } catch (e) {
    res.status(400).json({ message: "Something wrong happens" });
  }
};
const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "invalid details" });
  }
  try {
    const registeredUser = await User.findOne({ email: email });

    if (!registeredUser) {
      return res.status(401).json({
        status: 400,
        message: "invalid details",
        data: null,
      });
    } else {
      const isMatch = await bcrypt.compare(
        password.toString(),
        registeredUser.password.toString()
      );

      const payload = { id: registeredUser.id };
      const token = jwt.sign(payload, process.env.SERCETE_KEY, {
        expiresIn: 36000,
      });
      if (isMatch) {
        return res.status(200).json({
          status: 200,
          message: "Login Successfully",
          data: {
            jwt: token,
            user: { name: registeredUser.name, email: registeredUser.email },
          },
        });
      } else {
        return res.status(402).json({
          status: 400,
          message: "invalid details",
          data: null,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const AllUserData = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    const skip = (page - 1) * size;

    const total = await User.countDocuments();
    const users = await User.find().skip(skip).limit(size);

    res.status(200).json({
      data: users,
      total,
      page,
      size,
    });
  } catch (e) {
    console.log(e);
  }
};

const ResetPassword = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      const new_password = req.body.new_password;
      const confirm_password = req.body.confirm_password;
      if (new_password === confirm_password) {
        const updated_new_password = await bcrypt.hash(new_password, 12);
        const updated_confirm_password = await bcrypt.hash(
          confirm_password,
          12
        );
        const updatedDoc = await User.updateOne(
          userExist,
          {
            password: updated_new_password,
            confirm_password: updated_confirm_password,
          },
          {
            new: true,
          }
        );
        res.send({
          status: 201,
          message: "user password changed successfully",
        });
      } else {
        res.send({
          message: "password's are not matching",
        });
      }
    } else {
      res.send({
        message: "invalid Email id",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { RegisterUser, LoginUser, AllUserData, ResetPassword };
