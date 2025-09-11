const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }
    const userExists = await userModel.findOne({ email: email });

    if (userExists) {
      return res.status(409).json({
        message: "user already exists with same email ",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name: name,
      password: hashedPassword,
      email: email,
    });

    const payload = user._id;
    const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    if (user) {
      return res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "user registed sucessfully",
        });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "some error occured",
    });
  }
};

module.exports = { registerController };
