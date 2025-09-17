const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { json } = require("express");
const sendEmail = require("../utils/sendEmail");

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
      sendEmail({
        to: user.email,
        subject: "Welcome to STUDY-BOT!",
        template: "welcomeEmailtemplate.html",
      });

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
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "user logged in",
        user: { id: user._id, email: user.email },
      });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({
      message: "server error",
    });
  }
};
module.exports = { registerController, loginController };
