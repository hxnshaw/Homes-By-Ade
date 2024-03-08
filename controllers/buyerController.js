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
