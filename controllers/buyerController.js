const { Buyer } = require("../models");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

//register buyer
exports.registerBuyer = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    if (!email || !password || !first_name || !last_name)
      throw new CustomError.BadRequestError(
        "The details wey you give us no complete."
      );
    const emailAlreadyExists = await Buyer.findOne({ where: { email: email } });

    if (emailAlreadyExists)
      throw new CustomError.BadRequestError(
        "Person don already dey use this email"
      );
    const user = await Buyer.create({ email, password, first_name, last_name });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//login buyer
exports.loginBuyer = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new CustomError.BadRequestError("Your details no complete");
    const user = await Buyer.findOne({ where: { email: email } });
    if (!user) throw new CustomError.NotFoundError("who goes you?");
    const passwordIsCorrect = await user.comparePassword(password);
    if (!passwordIsCorrect)
      throw new CustomError.BadRequestError("Invalid credentials");
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ message: "login successful" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.logoutBuyer = async (req, res) => {
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

exports.getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.findAll({
      attributes: { exclude: ["password"] },
    });
    if (buyers === null) throw new CustomError.NotFoundError("Buyers no dey");
    res
      .status(StatusCodes.OK)
      .json({ data: buyers, number_of_buyers: buyers.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.viewSingleBuyer = async (req, res) => {
  const { id: buyerId } = req.params;
  try {
    const buyer = await Buyer.findOne({ where: { id: buyerId } });
    if (!buyer) throw new CustomError.NotFoundError("Buyer no dey");
    const tokenUser = createTokenUser(buyer);
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.viewMyBuyerProfile = async (req, res) => {
  const buyerId = req.user.userId;
  try {
    const buyer = await Buyer.findOne({ where: { id: buyerId } });
    if (!buyer) throw new CustomError.NotFoundError("Buyer no dey");
    const tokenUser = createTokenUser(buyer);
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
