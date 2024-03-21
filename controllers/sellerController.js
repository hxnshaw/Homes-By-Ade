const { Seller } = require("../models");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

exports.registerSeller = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    professional_type,
  } = req.body;
  try {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !phone_number ||
      !professional_type
    )
      throw new CustomError.BadRequestError(
        "Abeg gice us the complete details."
      );
    const emailAreadyUsed = await Seller.findOne({ where: { email } });
    if (emailAreadyUsed)
      throw new CustomError.BadRequestError(
        "Person don dey use this email address"
      );
    const user = await Seller.create({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      professional_type,
    });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw new CustomError.BadRequestError(
        "Abeg type your email and password"
      );
    const user = await Seller.findOne({ where: { email } });
    if (!user) throw new CustomError.NotFoundError("Who goes you?");
    const passwordIsCorrect = await user.comparePassword(password);
    if (!passwordIsCorrect)
      throw new CustomError.BadRequestError("Invalid Credentials");
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ meessage: "login successful" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.logoutSeller = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ message: "You are logged out" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.viewSingleSeller = async (req, res) => {
  const { id: buyerId } = req.params;
  try {
    const seller = await Seller.findOne({ where: { id: buyerId } });
    if (!seller) throw new CustomError.NotFoundError("Buyer Not Found");
    const tokenUser = createTokenUser(seller);
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.viewMySellerProfile = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json({ user: req.user });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
